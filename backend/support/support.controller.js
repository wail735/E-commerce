// ============================================================================
// FICHIER : backend 2/support/support.controller.js
// RÔLE : Contrôleur des tickets de support
// ============================================================================

import * as supportService from "./support.service.js";
import {
  createSupportTicketDTO,
  replySupportTicketDTO,
} from "./support.dto.js";

export const createTicket = async (req, res) => {
  try {
    const { error, value } = createSupportTicketDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const ticket = await supportService.createTicket(req.user._id, value);
    return res
      .status(201)
      .json({
        success: true,
        message: "Ticket de support créé avec succès !",
        data: ticket,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await supportService.getUserTickets(req.user._id);
    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const replyTicket = async (req, res) => {
  try {
    const { error, value } = replySupportTicketDTO.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const ticket = await supportService.replyTicket(req.params.id, value);
    return res
      .status(200)
      .json({ success: true, message: "Réponse enregistrée", data: ticket });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const data = await supportService.getAllTicketsForAdmin(req.query.page, req.query.limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
