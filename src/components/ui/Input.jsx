const Input = ({ label, type = "text", placeholder, className = "", ...props }) => {
  const renderLabel = (labelText) => {
    if (!labelText) return null;
    
    if (labelText.includes('*')) {
      const [text, star] = labelText.split('*');
      return (
        <>
          {text}
          <span className="text-subsonic-accent ml-0.5">*</span>
        </>
      );
    }
    return labelText;
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">
          {renderLabel(label)}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full bg-subsonic-surface border border-subsonic-border p-3 rounded-md text-sm text-subsonic-text 
                   focus:border-subsonic-accent focus:outline-none transition-all 
                   placeholder:text-subsonic-muted hover:border-subsonic-muted ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;