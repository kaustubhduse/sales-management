import React, { useState } from 'react';

const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState(['Services']);

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const menuItems = [
    { name: 'Dashboard', icon: '/dashboard.png' },
    { name: 'Nexus', icon: '/nexus.png' },
    { name: 'Intake', icon: '/intake.png' },
    {
      name: 'Services',
      icon: '/services.png',
      expandable: true,
      subitems: [
        { name: 'Pre-active', icon: '/pre-active.png' },
        { name: 'Active', icon: '/active.png' },
        { name: 'Blocked', icon: '/blocked.png' },
        { name: 'Closed', icon: '/closed.png' },
      ]
    },
    {
      name: 'Invoices',
      icon: '/invoices.png',
      expandable: true,
      subitems: [
        { name: 'Proforma Invoices', icon: '/proforma-invoices.png', bold: true },
        { name: 'Final Invoices', icon: '/final-invoices.png' },
      ]
    },
  ];

  return (
    <div className="w-60 bg-gray-50 border-r border-gray-200 py-6 flex flex-col fixed h-screen left-0 top-0 z-50">
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          V
        </div>
        <div className="text-xl font-bold text-gray-900">Vaultt</div>
      </div>
      
      <div className="flex-1 px-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div 
              onClick={() => item.expandable && toggleSection(item.name)}
              className={`flex items-center justify-between px-4 py-2 mb-0.5 rounded-lg cursor-pointer text-sm transition-all ${
                !item.expandable && item.name === 'Services'
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={item.icon} alt={item.name} className="w-5 h-5 opacity-60" />
                <span>{item.name}</span>
              </div>
              {item.expandable && (
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.includes(item.name) ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>

            {item.expandable && expandedSections.includes(item.name) && (
              <div className="ml-4 mb-0.5">
                {item.subitems.map((subitem) => (
                  <div
                    key={subitem.name}
                    className={`flex items-center gap-3 px-4 py-1.5 rounded-lg cursor-pointer text-sm transition-all ${
                      subitem.bold
                        ? 'text-gray-900 font-medium hover:bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <img src={subitem.icon} alt={subitem.name} className="w-4 h-4 opacity-60" />
                    <span>{subitem.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
