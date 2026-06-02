import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AI Portfolio – Claude Code Projects",
  description: "Claude / Claude Code を使ったAIツール・マルチエージェントシステムの開発実績",
};

const works = [
  {
    category: "AI × Web Scraping",
    title: "ニュース見出し収集・要約ツール",
    description:
      "Yahoo!ニュース・NHK・朝日新聞など複数ニュースサイトをClaudeが横断収集し、見出し一覧をリアルタイムで要約・整形して出力するツール。複数ソースの情報を一度に把握できる。",
    image: "/portfolio-news-claude.png",
    tags: ["Claude API", "Web Scraping", "Sonnet 4.6"],
    span: false,
    link: null,
  },
  {
    category: "CLI Tool",
    title: "Claude Code ターミナル出力",
    description:
      "Claude Code CLIから直接ニュース収集を実行。ターミナル上でリアルタイムに複数ソースの最新見出しを取得・整形する様子。開発者がコーディング中でも素早く情報収集できる。",
    image: "/portfolio-news-cli.png",
    tags: ["Claude Code", "CLI", "PowerShell"],
    span: false,
    link: null,
  },
  {
    category: "Multi-Agent System",
    title: "3エージェント自動化パイプライン",
    description:
      "Claude Code の SubAgents 機能を活用し、業界調査→差別化戦略構築→文章添削を3エージェントが順次バトンを渡して自動実行。最終成果物は「Must Fix / Should Fix / Nice to Have」の品質評価付きレポートとして出力される。",
    image: "/portfolio-subagents.png",
    tags: ["Claude Code", "SubAgents", "Pipeline", "Skills"],
    span: true,
    link: null,
    pipeline: [
      { phase: "Phase 1", label: "業界調査", agent: "industry-researcher" },
      { phase: "Phase 2", label: "差別化戦略", agent: "differentiation-builder" },
      { phase: "Phase 3", label: "文章添削", agent: "text-reviewer" },
    ],
  },
];

const stack = [
  { name: "Claude API", sub: "Sonnet 4.6" },
  { name: "Claude Code", sub: "CLI / SDK" },
  { name: "SubAgents", sub: "Multi-Agent" },
  { name: "Next.js", sub: "16 App Router" },
  { name: "TypeScript", sub: "Strict Mode" },
  { name: "Tailwind CSS", sub: "v4" },
];

export default function PortfolioPage() {
  return (
    <div className="portfolio-root">

      {/* NAV */}
      <nav className="portfolio-nav">
        <span className="nav-logo">AI × Claude Code</span>
        <div className="nav-links">
          <a href="#works">Works</a>
          <a href="#about">About</a>
          <a href="https://github.com/atsushisato1114" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className="portfolio-container">
        <section className="hero">
          <span className="hero-label">AI Development Portfolio</span>
          <div className="section-divider" />
          <h1 className="hero-h1">
            Building Intelligent<br />Agents with Claude
          </h1>
          <p className="hero-sub">
            Claude / Claude Code を使ったAIツール・<br />
            マルチエージェントシステムの開発実績
          </p>
          <div className="badge-row">
            {["Claude API", "Claude Code", "SubAgents", "Next.js 16", "TypeScript"].map((b) => (
              <span key={b} className="badge">{b}</span>
            ))}
          </div>
        </section>
      </div>

      {/* WORKS */}
      <section className="works-section" id="works">
        <div className="portfolio-container">
          <div className="section-header">
            <div className="section-divider" />
            <p className="section-label">Works</p>
            <p className="section-title">開発実績</p>
          </div>
          <div className="works-grid">
            {works.map((w) => (
              <div key={w.title} className={`work-card${w.span ? " card-full" : ""}`}>
                <div className="card-img-wrap">
                  <Image
                    src={w.image}
                    alt={w.title}
                    width={900}
                    height={w.span ? 220 : 260}
                    className="card-img"
                    style={{ objectPosition: "top" }}
                  />
                </div>
                <div className="card-body">
                  <p className="card-category">{w.category}</p>
                  <p className="card-title">{w.title}</p>
                  {"pipeline" in w && w.pipeline && (
                    <div className="pipeline">
                      {w.pipeline.map((s, i) => (
                        <div key={i} className="pipeline-step">
                          <span className="pipeline-phase">{s.phase}</span>
                          {s.label}
                          <small>{s.agent}</small>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="card-desc">{w.description}</p>
                  <div className="tag-row">
                    {w.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="portfolio-container">
          <div className="section-header">
            <div className="section-divider" />
            <p className="section-label">About</p>
            <p className="section-title">プロフィール</p>
          </div>
          <div className="about-inner">
            <div>
              <div className="section-divider-left" />
              <h2 className="about-h2">AI開発者</h2>
              <p className="about-text">
                Claude API・Claude Code を中心に、実務で使えるAIツールや
                マルチエージェントシステムを設計・開発しています。
                <br /><br />
                自動化パイプライン、情報収集、コンテンツ生成など、
                業務の現場で価値を発揮するソリューションを構築します。
                <br /><br />
                SubAgents・Skills・Hooks など Claude Code の高度な機能を
                活用し、複雑なタスクを自律的に処理するシステムを開発中です。
              </p>
              <div style={{ marginTop: "24px" }}>
                <a
                  href="https://github.com/atsushisato1114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button"
                >
                  GitHub を見る
                </a>
              </div>
            </div>
            <div className="stack-grid">
              {stack.map((s) => (
                <div key={s.name} className="stack-item">
                  <strong>{s.name}</strong>
                  <span>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="portfolio-footer">
        <p>
          <a href="https://github.com/atsushisato1114" target="_blank" rel="noopener noreferrer">
            GitHub: atsushisato1114
          </a>
          {" · "}Built with Claude Code
        </p>
        <p className="footer-sub">© 2026 AI Portfolio. All rights reserved.</p>
      </footer>

    </div>
  );
}
