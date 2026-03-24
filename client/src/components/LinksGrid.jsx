export default function LinksGrid({ links }) {
  return (
    <div className="links-grid">
      {links.map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noreferrer"
          className={`link-btn ${link.className}`}>
          <div className="link-icon">{link.icon}</div>
          <div className="link-text">{link.title}</div>
        </a>
      ))}
    </div>
  );
}
