import React from 'react';
import Hello from './components/Hello';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  return (
    <div className="App">
      <Hello name="World" />
      <FileUpload />
    </div>
  );
}

export default App;