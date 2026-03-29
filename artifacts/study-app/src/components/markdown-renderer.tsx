import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { hapticSuccess } from "@/lib/telegram";

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "";

  function copy() {
    navigator.clipboard.writeText(children.trim())
      .then(() => {
        hapticSuccess();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  return (
    <div className="relative group my-4 rounded-2xl overflow-hidden" style={{ background: "#1e1e2e", border: "1px solid rgba(124,92,252,0.12)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(124,92,252,0.08)", borderBottom: "1px solid rgba(124,92,252,0.08)" }}>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{lang || "code"}</span>
        <button onClick={copy}
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
          style={{ color: copied ? "#34d399" : "rgba(255,255,255,0.4)", background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)" }}>
          {copied ? "✓" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto scrollbar-hide">
        <code className="text-[13px] leading-[1.7] font-mono text-[#e2e8f0]">{children.trim()}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="md-content" style={{ color: "#1a1a2e" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", marginTop: 24, marginBottom: 12, lineHeight: 1.2 }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a2e", marginTop: 24, marginBottom: 10, lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2d2d44", marginTop: 16, marginBottom: 8 }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ fontSize: 14, fontWeight: 700, color: "#3d3d55", marginTop: 12, marginBottom: 6 }}>{children}</h4>,
          p: ({ children }) => <p style={{ fontSize: 14, color: "#4a4a6a", lineHeight: 1.8, marginBottom: 12 }}>{children}</p>,
          strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1a1a2e" }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: "#6b7280", fontStyle: "italic" }}>{children}</em>,
          blockquote: ({ children }) => (
            <blockquote style={{ margin: "12px 0", paddingLeft: 16, paddingTop: 8, paddingBottom: 8, borderLeft: "3px solid rgba(124,92,252,0.4)", background: "rgba(124,92,252,0.04)", borderRadius: "0 12px 12px 0" }}>
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 12px 4px" }} className="space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol style={{ listStyle: "none", padding: 0, margin: "12px 0 12px 4px" }} className="space-y-1.5">{children}</ol>,
          li: ({ children, ...props }) => {
            const isOrdered = (props as any).ordered;
            return (
              <li style={{ fontSize: 14, color: "#4a4a6a", lineHeight: 1.7, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, marginTop: 3, flexShrink: 0, color: isOrdered ? "#3B82F6" : "#7C5CFC" }}>
                  {isOrdered ? `${(props as any).index + 1}.` : "•"}
                </span>
                <span style={{ flex: 1 }}>{children}</span>
              </li>
            );
          },
          hr: () => <div style={{ margin: "20px 0", height: 1, background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.15), rgba(74,144,255,0.15), transparent)" }} />,
          a: ({ href, children }) => <a href={href} style={{ color: "#7C5CFC", textDecoration: "underline", textUnderlineOffset: 2 }}>{children}</a>,
          table: ({ children }) => (
            <div style={{ margin: "16px 0", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(124,92,252,0.1)" }}>
              <div className="overflow-x-auto scrollbar-hide">
                <table style={{ width: "100%", fontSize: 13 }}>{children}</table>
              </div>
            </div>
          ),
          thead: ({ children }) => <thead style={{ background: "rgba(124,92,252,0.06)" }}>{children}</thead>,
          th: ({ children }) => <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#1a1a2e", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", borderBottom: "1px solid rgba(124,92,252,0.1)" }}>{children}</th>,
          td: ({ children }) => <td style={{ padding: "12px 16px", color: "#4a4a6a", fontSize: 13, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>{children}</td>,
          tr: ({ children }) => <tr>{children}</tr>,
          code: ({ className, children, node, ...props }) => {
            const hasLang = className?.startsWith("language-");
            const content = String(children);
            const isBlock = hasLang || content.includes("\n");
            if (isBlock) {
              return <CodeBlock className={className}>{content}</CodeBlock>;
            }
            return (
              <code style={{ fontSize: 13, fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace", padding: "2px 6px", borderRadius: 6, color: "#7C5CFC", background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.08)" }}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
