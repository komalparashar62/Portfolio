"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Check, ChevronLeft, Plus, Minus, X, Menu, Mail, Phone, Layers, LayoutTemplate, MousePointer2, Compass, Workflow, CheckCircle2 } from "lucide-react";
import { queryOptions } from "../lib/enquiries";
const designServices = [
  { icon: LayoutTemplate, title: "Websites with a clear purpose", text: "From a focused landing page to a complex business website. Clear content, considered hierarchy and an experience that helps people take the next step.", tags: ["Website design", "Information architecture", "Responsive UI"] },
  { icon: Layers, title: "Products that feel intuitive", text: "Make complex tasks easier to navigate. Thoughtful flows and interfaces for digital products, dashboards and tools people use every day.", tags: ["UX / UI design", "User flows", "Dashboards & tools"] },
  { icon: MousePointer2, title: "Ideas you can interact with", text: "Move from an early idea to something you can explore. Wireframes and interactive prototypes help make decisions before development begins.", tags: ["Wireframes", "Interactive prototypes", "Design systems"] },
];
const pmItems = [
  { title: "Find the right problem", text: "Connect the business goal with what users need. Turn open questions into a clear brief and success criteria." },
  { title: "Choose what matters first", text: "Define the MVP, prioritise features and make scope decisions that fit the available time and resources." },
  { title: "Bring everyone onto the same page", text: "Translate ideas into requirements, user journeys and acceptance criteria so stakeholders and developers share the same understanding." },
  { title: "Carry the thinking through delivery", text: "Collaborate on feasibility, review implementation and define what to measure after launch." },
];
const phases = [
  { n: "01", name: "Understand", text: "Your goals, your audience and the problem worth solving.", output: "A shared brief" },
  { n: "02", name: "Shape", text: "The structure, key journeys and priorities for a useful first version.", output: "A clear direction" },
  { n: "03", name: "Design", text: "Visual exploration, detailed interfaces and interactive prototypes.", output: "A tangible experience" },
  { n: "04", name: "Deliver", text: "Organised handoff, developer collaboration and implementation review.", output: "A considered launch" },
];
function Arrow({ className = "" }: { className?: string }) { return <ArrowUpRight className={className} size={19} aria-hidden="true" />; }
export default function Home() {
  const [menu, setMenu] = useState(false);
  const [openPM, setOpenPM] = useState<number | null>(0);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const submissionId = useRef("");
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => { if (firstRender.current) { firstRender.current = false; return; } stepTitle.current?.focus(); }, [step]);
  function toggle(id: string) { setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); setError(""); }
  function next(e: React.FormEvent) { e.preventDefault(); if (!selected.length) { setError("Choose at least one option so I know how I can help."); return; } setError(""); setStep(2); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return; setError(""); setBusy(true);
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionId: submissionId.current, queries: selected, name, contactMethod: method, contact, website: honeypot }) });
      const data = await res.json() as { error?: string; ok?: boolean };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStep(3);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to connect. Please try again."); }
    finally { setBusy(false); }
  }
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header wrap">
      <a className="wordmark" href="#" aria-label="Komal Parashar home">komal<span>✳</span></a>
      <nav className={menu ? "nav opened" : "nav"} aria-label="Main navigation">
        <a href="#expertise" onClick={() => setMenu(false)}>Expertise</a><a href="#approach" onClick={() => setMenu(false)}>Approach</a><a href="#about" onClick={() => setMenu(false)}>A little about me</a>
        <a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <Arrow /></a>
      </nav>
      <button className="menu" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </header>
    <main id="main">
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="tiny-cross">✳</span> PRODUCT DESIGNER. PRODUCT THINKER.</div>
          <h1>Good ideas.<br />Clear thinking.<br /><span className="serif">Better design.</span></h1>
          <p>I’m Komal. I design websites and digital products, bringing a product manager’s perspective to every decision.</p>
          <a className="button dark" href="#contact">Let’s make something meaningful <Arrow /></a>
          <div className="hero-note"><span className="status-dot" /> Open to freelance projects & collaborations</div>
        </div>
        <div className="canvas" aria-label="Illustration of the journey from a complex idea to a clear design">
          <div className="canvas-top"><span>THE SPACE BETWEEN IDEA & EXPERIENCE</span><span>↗</span></div>
          <div className="canvas-grid" />
          <div className="canvas-orbit" />
          <div className="sticky"><span>Start here ↘</span><p>What are we<br />really solving?</p><span className="sticky-squiggle">〰</span></div>
          <div className="mini-window"><div className="window-top"><span /><span /><span /><i>an idea, taking shape</i></div><div className="mini-content"><div className="mini-sidebar"><b>k.</b><span /><span /><span /></div><div className="mini-main"><div className="mini-pill">A LITTLE MORE CLARITY</div><p>Make it<br /><em>make sense.</em></p><div className="mini-bars"><span /><span /></div><div className="mini-button">A better next step <ArrowRight size={12} /></div><div className="mini-blocks"><div /><div /><div /></div></div></div></div>
          <div className="cursor-label"><MousePointer2 size={23} fill="currentColor" /><span>Designed with intent</span></div>
          <div className="canvas-bottom"><span>BUSINESS GOALS</span><Plus size={12}/><span>HUMAN NEEDS</span><Plus size={12}/><span>DESIGN CRAFT</span></div>
          <div className="art-caption">A sketch of how I think. Every detail has a job.</div>
        </div>
      </section>
      <div className="ticker"><div className="wrap ticker-inner"><span>Clarity over complexity</span><span className="asterisk">✳</span><span>Thoughtful by design</span><span className="asterisk">✳</span><span>Grounded in product thinking</span><span className="asterisk">✳</span></div></div>
      <section id="expertise" className="expertise section wrap"><div className="section-heading"><div className="eyebrow">01 / WHAT I CAN HELP YOU CREATE</div><h2>From “we have an idea”<br />to <span className="serif">“this feels right.”</span></h2><p>Design that connects what your business needs with what your users are trying to do.</p></div>
        <div className="service-list">{designServices.map((s, i) => <article className="service" key={s.title}><div className="service-number">0{i + 1}</div><div className="service-icon"><s.icon size={24} strokeWidth={1.4} /></div><div className="service-copy"><h3>{s.title}</h3><p>{s.text}</p><div className="tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div></div><a href="#contact" className="service-arrow" aria-label={`Enquire about ${s.title}`} onClick={() => { setSelected([i === 0 ? "website" : "product"]); setStep(1); }}><Arrow /></a></article>)}</div>
      </section>
      <section className="product-section"><div className="wrap product-grid"><div className="product-intro"><div className="eyebrow">02 / THE PRODUCT PERSPECTIVE</div><h2>A designer’s eye.<br /><span className="serif">A PM’s perspective.</span></h2><p>My work as a Product Manager shapes how I design: understand the problem, make deliberate choices and stay connected to delivery.</p><div className="product-footnote"><Compass size={29} strokeWidth={1.3}/><span>Design craft, supported by<br /><b>business & product understanding.</b></span></div></div><div className="accordion">{pmItems.map((item, i) => <article key={item.title} className={openPM === i ? "accordion-item active" : "accordion-item"}><h3><button aria-expanded={openPM === i} aria-controls={`pm-panel-${i}`} onClick={() => setOpenPM(openPM === i ? null : i)}><span className="acc-number">0{i+1}</span><span>{item.title}</span>{openPM === i ? <Minus size={19}/> : <Plus size={19}/>}</button></h3><div id={`pm-panel-${i}`} hidden={openPM !== i}><p>{item.text}</p></div></article>)}</div></div></section>
      <section id="approach" className="section approach wrap"><div className="section-heading split"><div><div className="eyebrow">03 / HOW WE’LL WORK TOGETHER</div><h2>A clear process.<br /><span className="serif">Room to explore.</span></h2></div><p>Each project is different. We’ll shape the scope together, with clear decisions and useful outputs along the way.</p></div><div className="phase-grid">{phases.map(p => <article className="phase" key={p.n}><div className="phase-top"><span>{p.n}</span><ArrowUpRight size={19}/></div><h3>{p.name}</h3><p>{p.text}</p><div className="phase-output"><span>↳</span>{p.output}</div></article>)}</div></section>
      <section id="about" className="about wrap"><div className="about-art" aria-hidden="true"><span className="about-asterisk">✳</span><span className="about-art-copy">Curious mind.<br />Considered craft.</span><span className="about-signature">Komal.</span><span className="about-stamp">DESIGN + PRODUCT</span></div><div className="about-copy"><div className="eyebrow">04 / THE PERSON BEHIND THE PIXELS</div><h2>Hi, I’m Komal.<br /><span className="serif">I connect the dots.</span></h2><p>I’m a Product Manager building an independent design practice. I enjoy turning complex ideas, content and workflows into experiences that are easier to understand and use.</p><p>I bring a background in computer science and experience working with product and engineering teams. That helps me connect visual decisions with business context and how things will actually be built.</p><div className="about-bottom"><span><Workflow size={17}/> Design, strategy & delivery</span><span>Based in India · Working remotely</span></div></div></section>
      <section id="contact" className="contact-section"><div className="wrap contact-grid"><div className="contact-copy"><div className="eyebrow">05 / LET’S START WITH YOUR IDEA</div><h2>What’s on<br /><span className="serif">your mind?</span><span className="contact-star">✳</span></h2><p>A new website? A product idea? A flow that needs a little untangling? Tell me where you’d like a hand.</p><div className="contact-note"><span className="status-dot"/> Start with a question. We’ll take it from there.</div></div>
        <div className="enquiry-box">
          <div className="form-progress"><span className={step === 1 ? "current" : "complete"}>01 <i>Your query</i></span><div/><span className={step >= 2 ? "current" : ""}>02 <i>Your details</i></span></div>
          {step === 1 && <form onSubmit={next}><h3 ref={stepTitle} tabIndex={-1}>How can I help?</h3><p className="form-subtitle">Choose one or more. It’s okay if you’re still figuring it out.</p><fieldset className="query-list"><legend className="sr-only">Select your queries</legend>{queryOptions.map(q => <label className={selected.includes(q.id) ? "query-option selected" : "query-option"} key={q.id}><input type="checkbox" name="query" value={q.id} checked={selected.includes(q.id)} onChange={() => toggle(q.id)}/><span className="query-number">{q.icon}</span><span className="query-text"><b>{q.title}</b><small>{q.detail}</small></span><span className="check-box">{selected.includes(q.id) && <Check size={13}/>}</span></label>)}</fieldset>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button dark full">Submit queries <ArrowRight size={18}/></button><p className="form-micro">Next, choose how you’d like me to get in touch.</p></form>}
          {step === 2 && <form onSubmit={submit}><button type="button" className="back" onClick={() => { setStep(1); setError(""); }} disabled={busy}><ChevronLeft size={15}/> Edit your queries</button><h3 ref={stepTitle} tabIndex={-1}>Where can I reach you?</h3><p className="form-subtitle">Share your name and whichever contact option feels comfortable.</p><div className="selected-summary">{queryOptions.filter(q => selected.includes(q.id)).map(q => <span key={q.id}>{q.title}</span>)}</div><label className="field-label" htmlFor="visitor-name">Your name<input id="visitor-name" autoComplete="name" name="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="What should I call you?" disabled={busy}/></label><fieldset className="method-field"><legend>How would you prefer to connect?</legend><div className="method-options"><label className={method === "email" ? "chosen" : ""}><input type="radio" name="method" value="email" checked={method === "email"} onChange={()=>{ setMethod("email"); setContact(""); setError(""); }} disabled={busy}/><Mail size={17}/> Email</label><label className={method === "phone" ? "chosen" : ""}><input type="radio" name="method" value="phone" checked={method === "phone"} onChange={()=>{ setMethod("phone"); setContact(""); setError(""); }} disabled={busy}/><Phone size={17}/> Phone</label></div></fieldset><label className="field-label" htmlFor="visitor-contact">{method === "email" ? "Email address" : "Phone number"}<input key={method} id="visitor-contact" name="contact" type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} required maxLength={method === "email" ? 254 : 30} value={contact} onChange={e=>setContact(e.target.value)} placeholder={method === "email" ? "you@example.com" : "Include your country code"} disabled={busy}/></label><div className="honeypot" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button dark full" disabled={busy}>{busy ? "Sending your enquiry…" : "Send enquiry"}<ArrowRight size={18}/></button><p className="form-micro">Your details are saved with your enquiry and used to discuss your project. No mailing list.</p></form>}
          {step === 3 && <div className="success" role="status"><CheckCircle2 size={43} strokeWidth={1.2}/><div className="eyebrow">A GOOD PLACE TO START</div><h3 ref={stepTitle} tabIndex={-1}>Thank you, {name.trim().split(" ")[0]}.</h3><p>Your enquiry has been received. I have your selected queries and your {method === "email" ? "email address" : "phone number"} to follow up about your project.</p><div className="success-contact">{contact}</div><button className="text-button" onClick={()=>{ setStep(1); setSelected([]); setName(""); setContact(""); submissionId.current=""; }}>Have another question? <Arrow/></button></div>}
        </div>
      </div></section>
    </main>
    <footer className="footer wrap"><a className="wordmark" href="#">komal<span>✳</span></a><span>Thoughtfully designed. With a product perspective.</span><a href="#">Back to top <ArrowUpRight size={15}/></a><small>© {new Date().getFullYear()} Komal Parashar</small></footer>
  </>;
}
