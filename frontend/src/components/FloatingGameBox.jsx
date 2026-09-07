import React from 'react';
import './FloatingGameBox.css';
import gameBoxImg from '../../../public/sif/gameBox.png';

const FloatingGameBox = () => {
  return (
    <div className="floating-gamebox-container">
      <img
        src={gameBoxImg}
        alt="Game Box"
        className="floating-gamebox-img"
      />
    </div>
  );
};

export default FloatingGameBox;
