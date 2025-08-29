import React, { useState } from 'react';

const TestErrorComponent = () => {
  const [error, setError] = useState(null);
  const [translatedStack, setTranslatedStack] = useState('');

  const triggerError = () => {
    try {
      // Simulate an error with a component that would be stripped
      const ComponentName = () => null;
      ComponentName.nonExistentMethod();
    } catch (err) {
      setError(err);
      
      // Test error translation with the dev server
      fetch('http://localhost:3001/translate-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stack: err.stack }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTranslatedStack(data.translatedStack);
        })
        .catch((fetchErr) => {
          console.error('Failed to translate error:', fetchErr);
          setTranslatedStack('Error translation failed. Make sure dev-server is running.');
        });
    }
  };

  const testManifestInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/manifest-info');
      const data = await response.json();
      console.log('Manifest info:', data);
      alert(`Manifest loaded: ${data.hasManifest}\nMappings: ${data.manifestSize}`);
    } catch (err) {
      alert('Failed to get manifest info. Make sure dev-server is running.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🧪 Error Translation Test Component
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Run <code className="bg-blue-100 px-2 py-1 rounded">npm run build</code></li>
            <li>Run <code className="bg-blue-100 px-2 py-1 rounded">npm run postbuild</code></li>
            <li>Run <code className="bg-blue-100 px-2 py-1 rounded">npm run dev-server</code></li>
            <li>Click the buttons below to test error translation</li>
          </ol>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={triggerError}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🚨 Trigger Test Error
          </button>
          
          <button
            onClick={testManifestInfo}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📋 Check Manifest Info
          </button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Original Error Stack:</h3>
            <pre className="text-sm text-red-700 bg-red-100 p-3 rounded overflow-x-auto">
              {error.stack}
            </pre>
          </div>
        )}

        {translatedStack && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Translated Stack Trace:</h3>
            <pre className="text-sm text-green-700 bg-green-100 p-3 rounded overflow-x-auto">
              {translatedStack}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Expected Behavior:</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Original stack should show mangled names (e.g., <code>a0.nonExistentMethod</code>)</li>
            <li>Translated stack should show original names (e.g., <code>ComponentName.nonExistentMethod</code>)</li>
            <li>This demonstrates the semantic stripping and error translation working correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestErrorComponent;
