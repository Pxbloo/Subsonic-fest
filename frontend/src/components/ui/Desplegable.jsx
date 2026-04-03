import React, { useState } from "react";

const Desplegable = ({ items = [], className = "" }) => {
	const [openIndex, setOpenIndex] = useState(0);

	const handleToggle = (index) => {
		setOpenIndex((current) => (current === index ? -1 : index));
	};

	if (!items.length) {
		return null;
	}

	return (
		<div className={`space-y-3 ${className}`}>
			{items.map((item, index) => {
				const isOpen = index === openIndex;

				return (
					<div
						key={item.title ?? index}
						className="border border-subsonic-border rounded-lg overflow-hidden bg-subsonic-surface/60"
					>
						<button
							type="button"
							onClick={() => handleToggle(index)}
							className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-subsonic-surface transition-colors"
						>
							<span className="text-sm font-semibold text-subsonic-text uppercase tracking-wide">
								{item.title}
							</span>
							<span className="text-subsonic-accent text-xl leading-none">
								{isOpen ? "−" : "+"}
							</span>
						</button>
						{isOpen && (
							<div className="px-4 pb-4 pt-1 text-sm text-subsonic-muted leading-relaxed">
								{item.content}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default Desplegable;

