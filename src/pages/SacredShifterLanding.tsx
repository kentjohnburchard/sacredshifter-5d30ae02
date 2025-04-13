
const EnhancedStarfield: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black">
        <StarfieldBackground 
          density="medium" 
          opacity={0.3} 
          isStatic={false}
          starCount={200} 
          speed={0.5} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/60"></div>
    </div>
  );
};
