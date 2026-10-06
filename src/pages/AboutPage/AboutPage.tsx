import "./AboutPage.css";
import "../../styles/InfoPage.css";

function AboutPage() {
  return (
    <section className="info-page">
      <h1>ABOUT THE DUCK TEAM</h1>
      <p>
        We are Linda, Isabell and Oskar, three frontend students building The
        Quack Duck Shop together.
      </p>

      <div className="info-page__cards">
        <article className="info-page__card">
          <img
            className="about-page__image"
            src="/team/linda-duck.png"
            alt="Linda as a duck dressed as a captain"
          />
          <h2>Linda — The Accidental Captain 🦆</h2>
          <p>
            Nobody elected her captain. Nobody had to. Somehow, Linda ends up
            steering every team she joins — and according to her, every single
            one is a dream team. Coincidence? Or is she the common ingredient?
          </p>
        </article>

        <article className="info-page__card">
          <img
            className="about-page__image"
            src="/team/oskar-duck.png"
            alt="Oskar as a duck with round glasses and a coffee mug"
          />
          <h2>Oskar — Powered by Coffee ☕</h2>
          <p>
            Please allow one cup of coffee before expecting this duck to
            function. Once fully brewed, Oskar brings calm to the chaos and
            commit messages worth reading. Is everything under control? Hard to
            tell, but he certainly makes it look that way.
          </p>
        </article>

        <article className="info-page__card">
          <img
            className="about-page__image"
            src="/team/isabell-duck.png"
            alt="Isabell as a duck with dark hair and a colourful paint palette"
          />
          <h2>Isabell — The Creative Wildcard 🎨</h2>
          <p>
            Isabell’s brain has two settings: 47 colourful ideas per minute, or
            a single duck waddling around an empty office. There is no switch,
            no schedule and absolutely no customer support. Please check back
            after snacks.
          </p>
        </article>
      </div>
    </section>
  );
}

export default AboutPage;
