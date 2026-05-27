import React from "react";

/**
 * Shared site footer — 3-column layout matching design reference.
 * Brand (logo, name, lotus divider, url) | Follow Us (icons) | Contact
 * Bottom row: lotus ornaments + copyright.
 */
export default function SiteFooter({
  logoSrc = "/images/logo.webp",
}: {
  logoSrc?: string;
}) {
  return (
    <footer className="iskm-footer">
      <style>{footerCss}</style>
      <div className="iskm-footer__inner">
        {/* Brand */}
        <div className="iskm-footer__col iskm-footer__brand">
          <img
            src={logoSrc}
            alt="ISKM Singapore"
            width={96}
            height={96}
            className="iskm-footer__logo"
          />
          <h4 className="iskm-footer__name">ISKM Singapore</h4>
          <div className="iskm-footer__lotus-divider" aria-hidden="true">
            <span className="line" />
            <i className="fas fa-spa" />
            <span className="line" />
          </div>
          <a
            className="iskm-footer__url"
            href="https://srikrishnamandir.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            srikrishnamandir.org
          </a>
        </div>

        {/* Follow Us */}
        <div className="iskm-footer__col iskm-footer__follow">
          <div className="iskm-footer__heading" aria-hidden="true">
            <span className="dot" />
            <span className="label">FOLLOW US</span>
            <span className="dot" />
          </div>
          <h5 className="sr-only">Follow Us</h5>
          <div className="iskm-footer__socials">
            <a
              href="https://www.facebook.com/iskm.sg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="iskm-social iskm-social--fb"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://www.youtube.com/@iskmtv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="iskm-social iskm-social--yt"
            >
              <i className="fab fa-youtube" />
            </a>
            <a
              href="https://www.instagram.com/iskm.sg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="iskm-social iskm-social--ig"
            >
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="iskm-footer__col iskm-footer__contact">
          <h5 className="iskm-footer__contact-heading">CONTACT</h5>
          <div className="iskm-footer__contact-row">
            <i className="fas fa-map-marker-alt" aria-hidden="true" />
            <p>
              No.9 Lorong 29 Geylang
              <br />
              #03-02, Singapore 388065
            </p>
          </div>
          <div className="iskm-footer__contact-row">
            <i className="fas fa-envelope" aria-hidden="true" />
            <a href="mailto:contact@srikrishnamandir.org">
              contact@srikrishnamandir.org
            </a>
          </div>
          <div className="iskm-footer__contact-row">
            <i className="fab fa-whatsapp" aria-hidden="true" />
            <a
              href="https://wa.me/6562502280"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us →
            </a>
          </div>
        </div>
      </div>

      <div className="iskm-footer__bottom">
        <i className="fas fa-spa" aria-hidden="true" />
        <p>&copy; 2026 ISKM Singapore. All rights reserved.</p>
        <i className="fas fa-spa" aria-hidden="true" />
      </div>
    </footer>
  );
}

const footerCss = `
.iskm-footer{
  background:#0c2340;
  color:#e9ecf3;
  font-family:'Source Sans Pro', system-ui, sans-serif;
  padding:3.5rem 1.5rem 0;
  margin-top:auto;
}
.iskm-footer .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;}
.iskm-footer__inner{
  max-width:1200px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr 1fr;
  gap:2rem;align-items:start;
  padding-bottom:2.5rem;
  border-bottom:1px solid rgba(232,189,108,.18);
}
.iskm-footer__col{display:flex;flex-direction:column;}
.iskm-footer__brand{align-items:center;text-align:center;}
.iskm-footer__logo{width:96px;height:96px;object-fit:contain;margin-bottom:.75rem;}
.iskm-footer__name{
  font-family:'Playfair Display', Georgia, serif;
  font-size:1.85rem;font-weight:700;margin:0 0 .85rem;color:#fff;letter-spacing:.5px;
}
.iskm-footer__lotus-divider{display:flex;align-items:center;gap:.75rem;color:#e8bd6c;margin-bottom:.85rem;}
.iskm-footer__lotus-divider .line{width:70px;height:1px;background:linear-gradient(90deg,transparent,#e8bd6c,transparent);}
.iskm-footer__lotus-divider i{font-size:.95rem;}
.iskm-footer__url{color:#cfd6e4;text-decoration:none;font-size:1rem;}
.iskm-footer__url:hover{color:#e8bd6c;}

.iskm-footer__follow{align-items:center;text-align:center;padding-top:1.5rem;}
.iskm-footer__heading{display:flex;align-items:center;gap:.75rem;color:#e8bd6c;font-weight:700;letter-spacing:3px;font-size:.85rem;margin-bottom:1.5rem;}
.iskm-footer__heading .dot{width:50px;height:1px;background:linear-gradient(90deg,transparent,#e8bd6c,transparent);position:relative;}
.iskm-footer__heading .dot::after{content:"";position:absolute;top:50%;left:50%;width:4px;height:4px;border-radius:50%;background:#e8bd6c;transform:translate(-50%,-50%);}
.iskm-footer__socials{display:flex;gap:1.25rem;}
.iskm-social{
  width:52px;height:52px;border-radius:50%;
  display:inline-flex;align-items:center;justify-content:center;
  color:#fff;font-size:1.4rem;text-decoration:none;
  transition:transform .2s ease, box-shadow .2s ease;
  box-shadow:0 4px 14px rgba(0,0,0,.25);
}
.iskm-social:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,.35);}
.iskm-social--fb{background:#1877f2;}
.iskm-social--yt{background:#ff0000;}
.iskm-social--ig{background:radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);}

.iskm-footer__contact{padding-top:1.5rem;}
.iskm-footer__contact-heading{color:#e8bd6c;font-weight:700;letter-spacing:3px;font-size:.85rem;margin:0 0 1.25rem;}
.iskm-footer__contact-row{display:flex;gap:.85rem;align-items:flex-start;margin-bottom:1rem;}
.iskm-footer__contact-row i{color:#e8bd6c;font-size:1.1rem;margin-top:.2rem;width:20px;text-align:center;flex-shrink:0;}
.iskm-footer__contact-row p{margin:0;color:#cfd6e4;line-height:1.5;}
.iskm-footer__contact-row a{color:#cfd6e4;text-decoration:none;}
.iskm-footer__contact-row a:hover{color:#e8bd6c;}

.iskm-footer__bottom{
  max-width:1200px;margin:0 auto;
  display:flex;align-items:center;justify-content:center;gap:1.25rem;
  padding:1.5rem 0 1.75rem;
}
.iskm-footer__bottom i{color:#e8bd6c;opacity:.7;font-size:.9rem;}
.iskm-footer__bottom p{margin:0;color:#cfd6e4;opacity:.85;font-size:.95rem;}

@media (max-width:860px){
  .iskm-footer__inner{grid-template-columns:1fr;gap:2.5rem;text-align:center;}
  .iskm-footer__contact,.iskm-footer__follow{align-items:center;padding-top:0;}
  .iskm-footer__contact-row{justify-content:center;text-align:left;}
}
`;
