import React from 'react';

interface TestComponentProps {
  message?: string;
}

export const TestComponent: React.FC<TestComponentProps> = ({ message = 'Test deployment workflow' }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">🧪 Test Component</h2>
        <p className="text-base-content/70">{message}</p>
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