export const initialCategories = {
  equipment: {
    name: 'Equipment',
    items: [
      {
        name: 'MacBook Pro',
        cost: 4199,
        isEssential: true,
        isNeeded: true,
        link: 'https://www.apple.com/shop/buy-mac/macbook-pro',
        description:
          'Current 2013 Mac Pro is outdated and unable to run modern development tools like React Native',
      },
    ],
  },
  subscriptions: {
    name: 'Subscriptions',
    items: [
      {
        name: 'ChatGPT',
        cost: 200,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        link: 'https://chat.openai.com/',
        description: 'AI-powered assistance and productivity',
      },
      {
        name: 'Cursor',
        cost: 20,
        isEssential: true,
        isMonthly: true,
        isNeeded: false,
        link: 'https://cursor.sh/',
        description: 'Currently subscribed development tool',
      },
    ],
  },
  inventory: {
    name: 'Inventory',
    items: [
      {
        name: 'Vinyl Records',
        cost: 16500,
        isEssential: false,
        description: '500 copies',
        isAsset: true,
        isNeeded: false,
      },
      {
        name: 'Studio Equipment',
        cost: 7500,
        isEssential: true,
        isNeeded: true,
        isAsset: true,
        description: 'Music production and recording equipment',
      },
      {
        name: 'Music Catalog',
        cost: 1,
        isEssential: false,
        description: '200 songs across 50+ releases',
        isAsset: true,
        isNeeded: false,
      },
    ],
  },
  farming: {
    name: 'Farming Setup',
    items: [
      {
        name: 'Indoor Growing System',
        cost: 2000,
        isEssential: true,
        isNeeded: true,
        description:
          'For crops like yuca root, onions, garlic, guava, chilies, herbs, and lavender',
      },
      {
        name: 'Seeds and Supplies',
        cost: 500,
        isEssential: true,
        isNeeded: true,
        description: 'Initial farming supplies',
      },
    ],
  },
  operations: {
    name: 'Operations',
    items: [
      {
        name: 'Utilities',
        cost: 300,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Electricity, water, internet',
      },
      {
        name: 'Insurance',
        cost: 150,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Business liability and equipment insurance',
      },
      {
        name: 'Marketing',
        cost: 200,
        isEssential: false,
        isMonthly: true,
        isNeeded: true,
        description: 'Digital advertising and promotional materials',
      },
      {
        name: 'Maintenance',
        cost: 100,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Equipment and facilities maintenance',
      },
    ],
  },
  legal: {
    name: 'Legal & Admin',
    items: [
      {
        name: 'Business Registration',
        cost: 500,
        isEssential: true,
        isNeeded: true,
        description: 'LLC formation and permits',
      },
      {
        name: 'Accounting Software',
        cost: 30,
        isEssential: true,
        isMonthly: true,
        isNeeded: true,
        description: 'Financial tracking and reporting',
      },
      {
        name: 'Legal Consultation',
        cost: 1000,
        isEssential: true,
        isNeeded: true,
        description: 'Initial legal setup and consultation',
      },
    ],
  },
}

export const initialRevenue = {
  services: {
    name: 'Services',
    items: [
      {
        name: 'Web Development',
        price: 100,
        unit: 'per hour',
        estimated: 80,
        isMonthly: true,
        description: 'Custom web development services',
      },
      {
        name: 'Music Production',
        price: 500,
        unit: 'per project',
        estimated: 4,
        isMonthly: true,
        description: 'Music production and mixing services',
      },
      {
        name: 'Technical Consulting',
        price: 150,
        unit: 'per hour',
        estimated: 20,
        isMonthly: true,
        description: 'Technical architecture and consulting',
      },
    ],
  },
  sales: {
    name: 'Products',
    items: [
      {
        name: 'Farm Produce',
        price: 25,
        unit: 'per box',
        estimated: 40,
        isMonthly: true,
        description: 'Weekly vegetable and herb boxes',
      },
      {
        name: 'Vinyl Records',
        price: 35,
        unit: 'per unit',
        estimated: 30,
        isMonthly: true,
        description: 'Physical music releases',
      },
      {
        name: 'Digital Downloads',
        price: 10,
        unit: 'per album',
        estimated: 50,
        isMonthly: true,
        description: 'Digital music releases',
      },
    ],
  },
}
