import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import Desplegable from "@/components/ui/Desplegable.jsx";

const ContactUs = () => {
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		topic: "general",
		message: "",
	});

	const [status, setStatus] = useState({ type: null, message: "" });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setStatus({ type: null, message: "" });

		if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
			setStatus({
				type: "error",
				message: "Por favor, rellena los campos obligatorios.",
			});
			return;
		}

		setStatus({
			type: "success",
			message:
				"¡Mensaje enviado! Nos pondremos en contacto contigo lo antes posible.",
		});

		setForm({
			fullName: "",
			email: "",
			topic: "general",
			message: "",
		});
	};

	const faqItems = [
		{
			title: "¿Cómo puedo trabajar con Subsonic Festival?",
			content:
				"Si quieres colaborar como artista, marca, voluntariado o proveedor, cuéntanos tu propuesta en el formulario seleccionando el motivo 'Colaborar con el festival'. Nuestro equipo la revisará y se pondrá en contacto contigo.",
		},
		{
			title: "He tenido un problema con mi entrada, ¿qué hago?",
			content:
				"Adjunta en tu mensaje el número de pedido y el email con el que realizaste la compra. Revisaremos tu caso y te daremos una respuesta lo antes posible.",
		},
		{
			title: "¿Dónde puedo resolver dudas generales sobre el festival?",
			content:
				"Antes de escribirnos, echa un vistazo a la información de cada festival (fechas, horarios, recintos y accesos). Si sigues con dudas, selecciona el motivo 'Información general' y envíanos tu pregunta.",
		},
		{
			title: "Soy prensa o medio de comunicación",
			content:
				"Selecciona el motivo 'Prensa / Media' e indícanos el nombre del medio, tipo de cobertura y las fechas en las que estás interesado. Nuestro equipo de comunicación te responderá con los siguientes pasos.",
		},
	];

	return (
		<section className="max-w-6xl mx-auto py-10 md:py-14">
			<PageHeader title="Contacto" />

			<div className="grid gap-10 md:grid-cols-2">
				<div className="space-y-4">
					<h2 className="text-xl md:text-2xl font-black text-subsonic-text">
						Preguntas frecuentes
					</h2>
					<p className="text-sm text-subsonic-muted max-w-prose">
						Antes de escribirnos, revisa estas preguntas habituales sobre entradas,
						información general y colaboraciones. Puede que tu duda ya esté
						resuelta aquí.
					</p>

					<Desplegable items={faqItems} />
				</div>

				<div className="space-y-5">
					<h2 className="text-xl md:text-2xl font-black text-subsonic-text">
						Escríbenos
					</h2>
					<p className="text-sm text-subsonic-muted max-w-prose">
						Rellena el formulario para ponerte en contacto con el equipo de
						Subsonic Festival. Te responderemos en la dirección de correo que
						nos indiques.
					</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							name="fullName"
							label="Nombre completo*"
							placeholder="Tu nombre y apellidos"
							value={form.fullName}
							onChange={handleChange}
						/>

						<Input
							name="email"
							type="email"
							label="Correo electrónico*"
							placeholder="tucorreo@ejemplo.com"
							value={form.email}
							onChange={handleChange}
						/>

						<div className="space-y-1">
							<label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">
								Motivo del mensaje
							</label>
							<select
								name="topic"
								value={form.topic}
								onChange={handleChange}
								className="w-full bg-subsonic-surface border border-subsonic-border p-3 rounded-md text-sm text-subsonic-text focus:border-subsonic-accent focus:outline-none transition-all hover:border-subsonic-muted"
							>
								<option value="general">Información general</option>
								<option value="tickets">Problemas con entradas / pedidos</option>
								<option value="collab">Colaborar con el festival</option>
								<option value="press">Prensa / Media</option>
								<option value="other">Otro</option>
							</select>
						</div>

						<div className="space-y-1">
							<label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest ml-1">
								Mensaje*
							</label>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								rows={5}
								placeholder="Cuéntanos en qué podemos ayudarte..."
								className="w-full bg-subsonic-surface border border-subsonic-border p-3 rounded-md text-sm text-subsonic-text focus:border-subsonic-accent focus:outline-none transition-all placeholder:text-subsonic-muted hover:border-subsonic-muted resize-none"
							/>
						</div>

						{status.type && (
							<p
								className={`text-sm ${
									status.type === "success"
										? "text-emerald-400"
										: "text-red-400"
								}`}
							>
								{status.message}
							</p>
						)}

						<Button type="submit" variant="primary" className="mt-2">
							Enviar mensaje
						</Button>
					</form>

					<p className="text-xs text-subsonic-muted mt-3">
						También puedes escribirnos directamente a
						<span className="text-subsonic-accent ml-1">
							hello@subsonicfest.com
						</span>
						, indicando el festival y asunto de tu consulta.
					</p>
				</div>
			</div>
		</section>
	);
};

export default ContactUs;

