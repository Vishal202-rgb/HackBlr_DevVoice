"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatTurn, RetrievedChunk, SessionRecord } from "@/lib/types";
import { TranscriptPanel } from "@/components/dashboard/TranscriptPanel";
import { ContextCards } from "@/components/dashboard/ContextCards";
import { SuggestedActions } from "@/components/dashboard/SuggestedActions";
import { FloatingVoicePanel } from "@/components/dashboard/FloatingVoicePanel";
import { StatusChips } from "@/components/dashboard/StatusChips";
import {
  clearAllLocalSessions,
  deleteSessionLocally,
  duplicateSessionLocally,
  getAllSessionsLocally,
  getLastSessionIdLocally,
  saveSessionLocally,
} from "@/lib/storage";

type RecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  }
}

function speakText(text: string, onStart: () => void, onEnd: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

function makeId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function inferTitle(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return "New DevVoice Session";
  return compact.length > 48 ? `${compact.slice(0, 48)}...` : compact;
}

function hydrateFromSession(
  session: SessionRecord,
  setSessionId: (value: string | undefined) => void,
  setTurns: (value: ChatTurn[]) => void,
  setContexts: (value: RetrievedChunk[]) => void,
  setActions: (value: string[]) => void
) {
  setSessionId(session.id);
  setTurns(session.turns ?? []);
  setContexts(session.lastContexts ?? []);
  setActions(session.lastSuggestions ?? []);
}

export function DevVoiceConsole() {
  const [sessionId, setSessionId] = useState<string>();
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [contexts, setContexts] = useState<RetrievedChunk[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [savedSessions, setSavedSessions] = useState<SessionRecord[]>([]);
  const [sessionFilter, setSessionFilter] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [transcriptDraft, setTranscriptDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<RecognitionCtor> | null>(null);

  const refreshSavedSessions = () => {
    setSavedSessions(getAllSessionsLocally());
  };

  useEffect(() => {
    refreshSavedSessions();
    const lastSessionId = getLastSessionIdLocally();
    if (!lastSessionId) return;

    const lastSession = getAllSessionsLocally().find((session) => session.id === lastSessionId);
    if (!lastSession) return;

    hydrateFromSession(lastSession, setSessionId, setTurns, setContexts, setActions);
  }, []);

  const localSessionCount = savedSessions.length;

  const filteredSessions = useMemo(() => {
    const query = sessionFilter.trim().toLowerCase();
    if (!query) return savedSessions;
    return savedSessions.filter((session) => {
      const haystack = `${session.title} ${session.turns.map((turn) => turn.content).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [savedSessions, sessionFilter]);

  const latestAssistantText = useMemo(() => {
    return [...turns].reverse().find((turn) => turn.role === "assistant")?.content ?? "";
  }, [turns]);

  const selectedSessionLabel =
    savedSessions.find((session) => session.id === sessionId)?.title ??
    (sessionId ? "Unsaved current session" : "No session selected");

  const selectSession = (targetSession: SessionRecord) => {
    hydrateFromSession(targetSession, setSessionId, setTurns, setContexts, setActions);
    setError(null);
  };

  const deleteSavedSession = (targetSessionId: string) => {
    deleteSessionLocally(targetSessionId);
    refreshSavedSessions();
    if (sessionId === targetSessionId) {
      setSessionId(undefined);
      setTurns([]);
      setContexts([]);
      setActions([]);
      setTranscriptDraft("");
      setError(null);
    }
  };

  const duplicateSavedSession = (targetSessionId: string) => {
    const duplicate = duplicateSessionLocally(targetSessionId);
    if (!duplicate) {
      setError("Could not duplicate session.");
      return;
    }
    refreshSavedSessions();
    selectSession(duplicate);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setThinking(true);
    setError(null);
    const userTurn: ChatTurn = {
      id: makeId(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };
    setTurns((prev) => [...prev, userTurn]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Chat failed.");
      }

      const assistantTurn: ChatTurn = {
        id: makeId(),
        role: "assistant",
        content: data.answer,
        createdAt: new Date().toISOString(),
      };

      const resolvedContexts: RetrievedChunk[] = data.contexts ?? [];
      const resolvedActions: string[] = data.suggestions ?? [];

      setSessionId(data.sessionId);
      setTurns((prev) => [...prev, assistantTurn]);
      setContexts(resolvedContexts);
      setActions(resolvedActions);

      const localSessions = getAllSessionsLocally();
      const existingSession = localSessions.find((session) => session.id === data.sessionId);
      const existingTurns = existingSession?.turns ?? [];

      const sessionForStorage: SessionRecord = {
        id: data.sessionId,
        title: existingSession?.title ?? inferTitle(message),
        createdAt: existingSession?.createdAt ?? userTurn.createdAt,
        updatedAt: new Date().toISOString(),
        turns: [...existingTurns, userTurn, assistantTurn],
        lastContexts: resolvedContexts,
        lastSuggestions: resolvedActions,
      };
      saveSessionLocally(sessionForStorage);
      refreshSavedSessions();

      speakText(
        data.answer,
        () => setSpeaking(true),
        () => setSpeaking(false)
      );
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unknown error.");
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const startListening = () => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = async (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }
      setTranscriptDraft(interimText || finalText);
      if (finalText.trim()) {
        setTranscriptDraft("");
        await sendMessage(finalText.trim());
        if (!continuous) {
          recognition.stop();
          setListening(false);
        }
      }
    };
    recognition.onend = () => {
      if (!continuous) {
        setListening(false);
      }
    };
    recognition.onerror = () => setError("Voice recognition error.");
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const resumeLastSession = () => {
    const localSessions = getAllSessionsLocally();
    const lastSessionId = getLastSessionIdLocally();
    if (!lastSessionId) {
      setError("No local session available to resume.");
      return;
    }

    const lastSession = localSessions.find((session) => session.id === lastSessionId);
    if (!lastSession) {
      setError("No local session available to resume.");
      return;
    }

    hydrateFromSession(lastSession, setSessionId, setTurns, setContexts, setActions);
    setError(null);
  };

  const startNewSession = () => {
    setSessionId(undefined);
    setTurns([]);
    setContexts([]);
    setActions([]);
    setTranscriptDraft("");
    setError(null);
  };

  const clearLocalData = () => {
    clearAllLocalSessions();
    startNewSession();
    setSavedSessions([]);
  };

  return (
  <div className="pb-24 space-y-6">

    {/* HEADER */}
    <section className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Developer Voice Console
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Debug, analyze & interact with AI using voice + chat
          </p>
        </div>
        <StatusChips listening={listening} thinking={thinking} speaking={speaking} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={resumeLastSession} className="btn-secondary">Resume</button>
        <button onClick={startNewSession} className="btn-secondary">New</button>
        <button onClick={clearLocalData} className="btn-danger">
          Clear ({localSessionCount})
        </button>
      </div>
    </section>

    {/* 🔍 SESSION SEARCH */}
    <section className="glass rounded-2xl p-4">
      <div className="bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2">
        <input
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          placeholder="Search sessions..."
          className="w-full bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {filteredSessions.map((session) => (
          <div key={session.id} className="session-pill">
            <button onClick={() => selectSession(session)}>
              {session.title}
            </button>
            <button onClick={() => duplicateSavedSession(session.id)}>+</button>
            <button onClick={() => deleteSavedSession(session.id)}>×</button>
          </div>
        ))}
      </div>
    </section>

    {/* 💬 CHAT INPUT (UPGRADED) */}
    <form onSubmit={onSubmit} className="glass p-3 rounded-2xl">
      <div className="flex gap-3 items-center bg-[#020617] border border-gray-700 rounded-xl px-4 py-3">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about contract, risk, clause..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
        />

        <button
          type="submit"
          className="relative group bg-cyan-400 text-black px-4 py-2 rounded-xl font-semibold transition"
        >
          <span className="relative z-10">
            {thinking ? "..." : "Send"}
          </span>

          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition" />
        </button>
      </div>
    </form>

    {error && <p className="text-red-400">{error}</p>}

    {/* MAIN GRID */}
    <section className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TranscriptPanel turns={turns} />
      </div>

      <div className="space-y-4">
        <ContextCards chunks={contexts} />
        <SuggestedActions actions={actions} />
      </div>
    </section>

    {/* VOICE */}
    <FloatingVoicePanel
      transcriptDraft={transcriptDraft}
      listening={listening}
      continuous={continuous}
      onStartPushToTalk={startListening}
      onStopListening={stopListening}
      onToggleContinuous={() => setContinuous((prev) => !prev)}
    />

    {/* RESULT */}
    {latestAssistantText && (
      <section className="glass p-5 rounded-2xl">
        <p className="text-xs text-gray-400">Latest Output</p>
        <pre className="mt-2 text-sm text-gray-200 whitespace-pre-wrap">
          {latestAssistantText}
        </pre>
      </section>
    )}
  </div>
);
}