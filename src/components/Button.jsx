const Button = ({ children, onClick, variant = 'primary', type = 'button', className = ''}) => {

    const base = "font-bold uppercase rounded-full text-sm transition";

    const variants = {
        ghost: "text-subsonic-text hover:text-subsonic-btn",
        primary: "bg-subsonic-accent text-subsonic-bg hover:bg-subsonic-text px-6 py-2",
        outline: "border-2 border-subsonic-accent text-subsonic-accent hover:bg-subsonic-accent hover:text-subsonic-bg px-8 py-3",
        primarySmall: "bg-subsonic-accent text-subsonic-bg px-4 py-2 text-xs hover:opacity-80"
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;