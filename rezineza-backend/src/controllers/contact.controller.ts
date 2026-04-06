import { Request, Response } from "express";
import { createContactSchema } from "@/dtos/contact.dto";
import * as contactService from "@/services/contact.service";

export const getAll = async (req: Request, res: Response) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export async function send(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
      return;
    }
    await contactService.createContact(parsed.data, req.userId);
    res.json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message", error });
  }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await contactService.deleteContact(Number(req.params.id));
        if (!result) return res.status(404).json({ message: "Contact introuvable" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};