const API_URL = "http://localhost:3000";

export const sendContact = async (data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<void> => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Erreur lors de l'envoi du message");
  }
};