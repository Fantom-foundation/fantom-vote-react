import React from 'react';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';

export default function App() {
  return <FDTPicker />;
}

class FDTPicker extends React.Component {
  render() {
    return <Datetime ref="datetime" renderView={(mode, renderDefault) => this.renderView(mode, renderDefault)} />;
  }

  renderView(mode, renderDefault) {
    // Only for years, months and days view
    if (mode === 'time') return renderDefault();

    return (
      <div className="wrapper">
        {renderDefault()}
        <div className="controls">
          <button onClick={() => this.goToToday()}>Today</button>
        </div>
      </div>
    );
  }

  goToToday() {
    // Reset
    this.refs.datetime.setViewDate(new Date());
    this.refs.datetime.navigate('days');
  }
}
