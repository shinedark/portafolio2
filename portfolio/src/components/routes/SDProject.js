import React from 'react'
import './Routes.css'

const SDProject = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Shine Dark Music: Where Music Cultivates Sustainability</h3>
        <p>
          Welcome to the journey of Shine Dark Music, where we're not just
          creating music but Awakening Human Beings via Technology & Art to
          foster a sustainable future.
        </p>
      </div>

      <div className="route-section">
        <h3>Our Music</h3>
        <ul>
          <li>
            Catalog: 186 tracks across 47 releases, available in digital and
            physical formats.
          </li>
          <li>
            Vinyl: Currently, we have 1 vinyl release with 500 copies at $33
            each.{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.shinedarkmusic.com/"
            >
              Purchase Here
            </a>
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Community Engagement</h3>
        <p>
          Social Media Rewards: We are exploring the use of Opacity Network to
          reward fans for engaging with our records on social media, fostering a
          community-driven approach to music sharing.
        </p>
      </div>

      <div className="route-section">
        <h3>Sustainability Commitment</h3>
        <ul>
          <li>
            <strong>Carbon Footprint:</strong> We recognize that every
            interaction with our music has an environmental impact, which we aim
            to mitigate through innovative projects like our steel building
            farm.
          </li>
          <li>
            <strong>The Project:</strong> Transforming a warehouse in Colorado
            into a multifunctional space for living, working, and hydroponic
            farming, where we study how music influences plant growth. Here, we
            grow plants that serve dual purposes - as a source of food and
            medicine for me, and as a reusable resource for broader
            sustainability efforts.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Health and Innovation</h3>
        <p>
          Personal Journey: My health needs have driven this project, where
          plants are not only a source of nourishment and healing for me but are
          also central to our ethos of reuse and sustainability.
        </p>
      </div>

      <div className="route-section">
        <h3>Media and Promotion</h3>
        <p>
          We will document and share this journey via our media channels,
          engaging our audience with updates on sustainability, health, and
          music.
        </p>
      </div>

      <div className="route-section">
        <h3>Get Involved</h3>
        <p>
          Join us at shinedark.dev to follow this pioneering journey. Together,
          let's grow, create, and inspire a sustainable future.
        </p>
      </div>
    </div>
  )
}

export default SDProject
