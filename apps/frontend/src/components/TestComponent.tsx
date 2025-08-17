import React from 'react';

interface TestComponentProps {
  message?: string;
}

export const TestComponent: React.FC<TestComponentProps> = ({ message = 'Test deployment workflow' }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">🧪 Test Component</h2>
        <p className="text-base-content/70">{message}</p>
        <p className="text-xs text-base-content/50">Frontend deployment test - {new Date().toLocaleDateString()}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm">
            Deployment Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;