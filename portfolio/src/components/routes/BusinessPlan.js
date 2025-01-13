import React from 'react'
import ProjectCostCalculator from '../calculators/ProjectCostCalculator'
import './Routes.css'

const BusinessPlan = () => {
  return (
    <div className="route-page">
      <div className="route-section">
        <h3>Business Plan for Shine Dark Music</h3>
      </div>

      <div className="route-section">
        <h3>Company Description</h3>
        <ul>
          <li>
            Type: Media Company with a focus on music production, technology,
            and sustainable living.
          </li>
          <li>
            Location: To based in Colorado, with plans to transform a warehouse
            into a sustainable living and working space.
          </li>
          <li>
            Unique Selling Proposition: Combining music with sustainability
            initiatives, leveraging technology for community engagement and
            personal health.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Mission</h3>
        <p>
          Shine Dark Music is dedicated to Awakening Human Beings via Technology
          & Art, innovating at the intersection of music, sustainability, and
          health to create a replicable model for modern living.
        </p>
      </div>

      <div className="route-section">
        <h3>Products and Services</h3>
        <ul>
          <li>
            Music Releases: 186 tracks in 47 releases, available digitally and
            on vinyl.
          </li>
          <li>
            Sustainable Project: Development of a self-sustaining environment
            including hydroponic farming where plants are used for both food and
            clothing (e.g., hemp jeans), alongside sound therapy for plant
            growth.
          </li>
          <li>
            Community Engagement: A reward system through Opacity Network for
            social media interaction.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Market Analysis</h3>
        <ul>
          <li>
            Target Market: Music enthusiasts, health-conscious individuals,
            sustainability advocates, and technology users interested in
            innovative projects.
          </li>
          <li>
            Competitive Advantage: Unique blend of music, health, and
            sustainability, with a strong community engagement model.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Marketing and Sales Strategy</h3>
        <ul>
          <li>
            Social Media: Use of music and project documentation to drive
            engagement, with rewards for fan interaction.
          </li>
          <li>
            Direct Sales: Selling vinyl records at $33 each, with potential for
            exclusive releases or limited editions tied to project milestones.
          </li>
          <li>
            Content Creation: Regular updates, educational content, and
            behind-the-scenes looks at the project to build a narrative around
            sustainability, health, and the innovative use of plant materials.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Operational Plan</h3>
        <ul>
          <li>
            Project Development: Phased transformation of the warehouse into a
            sustainable living space, including setting up hydroponics, research
            facilities, and a small-scale clothing production area for hemp
            jeans.
          </li>
          <li>
            Technology Integration: Use of coding for project management,
            content creation, and community interaction tools.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Financial Plan</h3>
        <ul>
          <li>
            Revenue Streams: Sales from music releases, potential sponsorships
            or partnerships related to sustainability, clothing sales, and
            possible grants for eco-innovation.
          </li>
          <li>
            Cost Structure: Costs associated with music production, vinyl
            manufacturing, building transformation, hydroponic setup, clothing
            production, and ongoing operational expenses.
          </li>
          <li>
            Funding: Initial investment from personal funds, potential
            crowdfunding for community involvement, and seeking investors
            interested in sustainable media, health, and eco-fashion
            initiatives.
          </li>
        </ul>
      </div>

      <div className="route-section">
        <h3>Future Outlook</h3>
        <p>
          Shine Dark Music aims to lead by example in showing how media
          companies can pivot towards sustainability, influencing cultural
          perceptions of living, industry practices, and fashion. We plan to
          expand our reach in music distribution, sustainable living, and
          eco-conscious clothing, fostering a community that lives by our
          tagline: Where Music Cultivates Sustainability.
        </p>
      </div>

      <ProjectCostCalculator />
    </div>
  )
}

export default BusinessPlan
