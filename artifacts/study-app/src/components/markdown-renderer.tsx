import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { hapticSuccess } from "@/lib/telegram";

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "";

  function copy() {
    navigator.clipboard.writeText(children.trim());
    hapticSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group my-4 rounded-2xl overflow-hidden" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">{lang || "code"}</span>
        <button onClick={copy}
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
          style={{ color: copied ? "#34d399" : "rgba(255,255,255,0.25)", background: copied ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)" }}>
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
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-[20px] font-black text-white mt-6 mb-3 leading-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[17px] font-black text-white mt-6 mb-2.5 leading-tight flex items-center gap-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[15px] font-bold text-white/90 mt-4 mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-[14px] font-bold text-white/80 mt-3 mb-1.5">{children}</h4>,
          p: ({ children }) => <p className="text-[14px] text-white/65 leading-[1.8] mb-3">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-white/90">{children}</strong>,
          em: ({ children }) => <em className="text-white/50 italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-4 py-2 rounded-r-xl" style={{ borderLeft: "3px solid rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.04)" }}>
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-none space-y-1.5 my-3 pl-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-none space-y-1.5 my-3 pl-1 counter-reset-item">{children}</ol>,
          li: ({ children, ...props }) => {
            const isOrdered = (props as any).ordered;
            return (
              <li className="text-[14px] text-white/60 leading-[1.7] flex gap-2">
                <span className="text-[12px] mt-[3px] shrink-0" style={{ color: isOrdered ? "#67e8f9" : "#a78bfa" }}>
                  {isOrdered ? `${(props as any).index + 1}.` : "•"}
                </span>
                <span className="flex-1">{children}</span>
              </li>
            );
          },
          hr: () => <div className="my-5 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.2), rgba(6,182,212,0.2), transparent)" }} />,
          a: ({ href, children }) => <a href={href} className="text-[#a78bfa] underline underline-offset-2 hover:text-[#c4b5fd]">{children}</a>,
          table: ({ children }) => (
            <div className="my-4 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-[13px]">{children}</table>
              </div>
            </div>
          ),
          thead: ({ children }) => <thead style={{ background: "rgba(124,58,237,0.08)" }}>{children}</thead>,
          th: ({ children }) => <th className="px-4 py-3 text-left font-bold text-white/70 text-[12px] uppercase tracking-wider whitespace-nowrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 text-white/55 text-[13px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{children}</td>,
          tr: ({ children }) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
          code: ({ className, children, node, ...props }) => {
            const isInPre = node?.position && (node as any).parentNode?.tagName === "pre";
            const hasLang = className?.startsWith("language-");
            const content = String(children);
            if (hasLang || isInPre) {
              return <CodeBlock className={className}>{content}</CodeBlock>;
            }
            return (
              <code className="text-[13px] font-mono px-1.5 py-0.5 rounded-md text-[#c4b5fd]"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.08)" }}>
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
