"use client";

import { useState } from "react";

type TestResult = {
  label: string;
  response: Record<string, unknown> | null;
  error: string | null;
  status: "idle" | "loading" | "done" | "error";
};

export default function Home() {
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (index: number, update: Partial<TestResult>) => {
    setResults((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...update };
      return copy;
    });
  };

  const runTest = async (
    label: string,
    url: string,
    index: number
  ) => {
    updateResult(index, { status: "loading", response: null, error: null });
    try {
      const res = await fetch(url);
      const data = await res.json();
      updateResult(index, { status: "done", response: data });
    } catch (err) {
      updateResult(index, {
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const tests = [
    {
      label: "Test 1: Basic params",
      url: "/api/test-params?foo=bar&baz=123",
    },
    {
      label: "Test 2: Artworks (exact repro)",
      url: "/api/image-ai/artworks?newestFirst=true&skip=20&limit=20",
    },
    {
      label: "Test 3: Many params",
      url: "/api/test-params?a=1&b=2&c=3&d=4&e=5",
    },
    {
      label: "Test 4: Special characters",
      url: "/api/test-params?query=hello%20world&filter=a%26b",
    },
    {
      label: "Test 5: No params (baseline)",
      url: "/api/test-params",
    },
  ];

  const runAllTests = () => {
    const initial = tests.map((t) => ({
      label: t.label,
      response: null,
      error: null,
      status: "idle" as const,
    }));
    setResults(initial);

    tests.forEach((t, i) => {
      runTest(t.label, t.url, i);
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          🔍 Appwrite Sites — Search Params Bug Repro
        </h1>
        <p className="text-gray-400 mb-6">
          This app tests whether Next.js API route search/query parameters are
          correctly received on Appwrite Sites. The reported issue: params like{" "}
          <code className="bg-gray-800 px-1 rounded">
            ?newestFirst=true&skip=20&limit=20
          </code>{" "}
          are stripped server-side.
        </p>

        <button
          onClick={runAllTests}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg mb-8 transition-colors cursor-pointer"
        >
          ▶ Run All Tests
        </button>

        <div className="space-y-6">
          {tests.map((test, i) => {
            const result = results[i];
            return (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-lg p-5"
              >
                <h2 className="text-lg font-semibold mb-1">{test.label}</h2>
                <p className="text-sm text-gray-500 font-mono mb-3">
                  GET {test.url}
                </p>

                {!result || result.status === "idle" ? (
                  <p className="text-gray-600 text-sm">Not run yet</p>
                ) : result.status === "loading" ? (
                  <p className="text-yellow-400 text-sm">Loading...</p>
                ) : result.status === "error" ? (
                  <p className="text-red-400 text-sm">Error: {result.error}</p>
                ) : (
                  <div>
                    {/* Highlight the key finding */}
                    {(() => {
                      const r = result.response as Record<string, unknown>;
                      const hasBug =
                        r &&
                        test.url.includes("?") &&
                        (r.searchString === "" || r.searchString === null);
                      return (
                        <div
                          className={`mb-3 p-3 rounded text-sm font-semibold ${
                            hasBug
                              ? "bg-red-900/50 text-red-300 border border-red-700"
                              : "bg-green-900/50 text-green-300 border border-green-700"
                          }`}
                        >
                          {hasBug
                            ? "❌ BUG CONFIRMED: Search params were STRIPPED!"
                            : "✅ Params received correctly"}
                        </div>
                      );
                    })()}

                    <details>
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-200">
                        Full response
                      </summary>
                      <pre className="mt-2 bg-gray-800 p-3 rounded text-xs overflow-auto max-h-64">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 bg-gray-900 border border-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">📋 How to reproduce</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
            <li>Deploy this app to Appwrite Sites</li>
            <li>Click &quot;Run All Tests&quot; on the deployed version</li>
            <li>
              If the bug exists, tests with query params will show{" "}
              <span className="text-red-400">red ❌ BUG CONFIRMED</span> status
            </li>
            <li>
              Compare with running locally (
              <code className="bg-gray-800 px-1 rounded">npm run dev</code>)
              where all tests should pass ✅
            </li>
            <li>Check Appwrite Sites logs for server-side console output</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
