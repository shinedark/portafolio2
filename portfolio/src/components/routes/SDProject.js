import React from 'react'
import './Routes.css'

const SDProject = () => {
  return (
    <div className="route-page max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6">SHINE DARK MUSIC</h3>
      <p className="text-lg mb-4">Awakening Human Being Via Technology & Art</p>
      <p className="text-lg mb-4">
        We are on a mission to be an inspiration for anyone who wants to learn,
        grow, and create. As a record label and artist, I'm setting out to
        change and remind people of what an artist can do.
      </p>
      <div className="route-section">
        <h4 className="text-2xl font-bold mb-6">Purpose</h4>
        <p className="text-lg mb-4">
          Our motto at the label has been "Awakening Human Beings via Technology
          & Art" and that's exactly what we are going to do. Our purpose is to
          inspire and cultivate minds in this time of change.
        </p>
      </div>
      <div className="route-section space-y-8">
        <h3 className="text-2xl font-bold mb-6">Current Project</h3>

        {/* What I'm Working On Section */}
        <section className="space-y-4">
          <h4 className="text-xl font-semibold">What I'm Working On</h4>
          <ol className="space-y-4">
            <li className="space-y-2">
              <span className="font-medium">Music Releases</span>
              <ul className="ml-6">
                <li>
                  Re-release of 47 SDM Tracks: Strategically releasing previous
                  works to maximize their value and reach new audiences.
                </li>
              </ul>
            </li>

            <li className="space-y-2">
              <span className="font-medium">Opacity Network Integration</span>
              <ul className="ml-6">
                <li>Building a system to:</li>
                <ul className="ml-6">
                  <li>Track viral content.</li>
                  <li>Reward users for engagement.</li>
                  <li>
                    Audit distribution platforms and payments to ensure accurate
                    royalty distribution.
                  </li>
                </ul>
              </ul>
            </li>

            <li className="space-y-2">
              <span className="font-medium">Pan de Yuca Club</span>
              <ul className="ml-6">
                <li>
                  Objective: Secure funding for operations and refine processes
                  for better documentation.
                </li>
              </ul>
            </li>

            <li className="space-y-2">
              <span className="font-medium">Building a Farm</span>
              <ul className="ml-6">
                <li>Current Phase: Research and learning.</li>
                <li>
                  Focus: Indoor farming of crops like yuca root, onions, garlic,
                  guava, chilies, herbs, and lavender, tailored to dietary needs
                  and health limitations.
                </li>
              </ul>
            </li>

            <li className="space-y-2">
              <span className="font-medium">App Development</span>
              <ul className="ml-6">
                <li>
                  Goal Tracker App: A tool to display goals on websites for
                  better visibility and motivation.
                </li>
                <li>
                  SDM Store Integration: Incorporating PayPal functionality for
                  smoother transactions.
                </li>
                <li>
                  Opacity Network Integration: On hold until funding is secured
                  for the necessary computer hardware.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Vision Section */}
        <section className="space-y-4">
          <h4 className="text-xl font-semibold">Vision</h4>
          <p className="mb-4">
            The aim is to create sustainable revenue streams that support a
            balanced lifestyle while merging artistic pursuits with practical
            endeavors.
          </p>
          <ul className="space-y-4 ml-4">
            <li>
              <span className="font-medium">Music:</span>
              <ul className="ml-6">
                <li>
                  Feed the soul and generate content for personal use and social
                  media monetization.
                </li>
                <li>
                  Leverage distribution channels for payments, royalties, and
                  other value-generating opportunities.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Farm:</span>
              <ul className="ml-6">
                <li>
                  Address personal dietary limitations by growing specific
                  crops.
                </li>
                <li>
                  Explore revenue streams through agricultural output, such as
                  yuca root, herbs, and spices.
                </li>
              </ul>
            </li>
          </ul>
          <p className="mt-4">
            This holistic approach ties artistic expression, technology, and
            sustainable living into a unified lifestyle and persona.
          </p>
        </section>

        {/* Initial Valuation Section */}
        <section className="space-y-4">
          <h4 className="text-xl font-semibold">Initial Valuation</h4>
          <ol className="space-y-4 ml-4">
            <li>
              <span className="font-medium">Inventory</span>
              <ul className="ml-6">
                <li>Vinyl Records: 500 copies valued at $16,500.</li>
                <li>
                  Music Catalog: 200 songs across 50+ releases (valuation TBD).
                </li>
                <li>Studio Equipment: Valued at $7,500.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Needs</span>
              <ul className="ml-6">
                <li>
                  Laptop (MacBook Pro): $4,199 + tax.
                  <ul className="ml-6">
                    <li>
                      Justification: Current 2013 Mac Pro is outdated and unable
                      to run modern development tools like React Native.
                    </li>
                  </ul>
                </li>
                <li>
                  ChatGPT Subscription: $200/month for AI-powered assistance and
                  productivity.
                </li>
                <li>Cursor Subscription: $20/month (currently subscribed).</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Next Steps Section */}
        <section className="space-y-4">
          <h4 className="text-xl font-semibold">Next Steps & Opportunities</h4>
          <ol className="space-y-4 ml-4">
            <li>
              <span className="font-medium">Funding Priorities:</span>
              <ul className="ml-6">
                <li>
                  Secure a new laptop to enable development projects and app
                  integrations.
                </li>
                <li>
                  Maintain essential subscriptions for productivity tools like
                  ChatGPT and Cursor.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Music Monetization:</span>
              <ul className="ml-6">
                <li>
                  Optimize distribution platforms for the re-release of music.
                </li>
                <li>
                  Leverage Opacity Network to incentivize user engagement and
                  ensure transparent royalty payments.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Farm Planning:</span>
              <ul className="ml-6">
                <li>Develop a blueprint for indoor farming operations.</li>
                <li>
                  Identify potential revenue streams from produce and specialty
                  items (e.g., herbs, spices).
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Community Engagement:</span>
              <ul className="ml-6">
                <li>Utilize Pan de Yuca Club for networking and funding.</li>
                <li>
                  Foster collaborations with external platforms to enhance
                  content reach and revenue potential.
                </li>
              </ul>
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}

export default SDProject
