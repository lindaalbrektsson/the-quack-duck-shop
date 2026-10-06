import "../../styles/InfoPage.css";

function ContactPage() {
  return (
    <section className="info-page">
      <h1>CONTACT THE DUCK TEAM</h1>
      <p>
        Got a question, a duck emergency or a really good pun? Give us a quack!
        Our team is almost ready. We're still trying to get our ducks in a row.
      </p>

      <div className="info-page__cards">
        <article className="info-page__card">
          <h2>Linda — The Accidental Captain 🦆</h2>
          <p>
            Questions about your order? Linda will point you in the right
            direction. She has a plan, a backup plan and probably a duck for both.
          </p>
          <p>
            <a href="mailto:captain.linda@duckmail.example">
              captain.linda@duckmail.example
            </a>
          </p>
        </article>

        <article className="info-page__card">
          <h2>Oskar — Powered by Coffee ☕</h2>
          <p>
            Something gone quackers? Oskar handles technical questions. Replies
            may arrive faster after his first cup of coffee.
          </p>
          <p>
            <a href="mailto:coffee.oskar@duckmail.example">
              coffee.oskar@duckmail.example
            </a>
          </p>
        </article>

        <article className="info-page__card">
          <h2>Isabell — The Creative Wildcard 🎨</h2>
          <p>
            Got an idea for our next duck? Isabell is ready to hear it. Warning:
            one small idea may turn into an entire duck collection.
          </p>
          <p>
            <a href="mailto:wildcard.isabell@duckmail.example">
              wildcard.isabell@duckmail.example
            </a>
          </p>
        </article>
      </div>

      <h2>DUCK HEADQUARTERS</h2>
      <p>
        The Quack Duck Shop · 12 Waddle Way · Duckburg
        <br />
        Monday–Friday, 09:00–16:00. Weekends closed for very important pond meetings.
      </p>
      <p>
        This is a school project. All contact details are made up, and these
        inboxes are not monitored.
      </p>
    </section>
  );
}

export default ContactPage;
