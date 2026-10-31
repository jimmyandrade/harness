---
locale: en
---

# Name the open call skill after the edital

## Status

Accepted

## Context

A person applied to a course of a public cultural institution. The selection result came out months later, in a document on the site of the foundation that maintains the institution, and no email announced it. The applications for the next class opened and closed the same way. A skill now finds both on the web: the selection result of an open call the person applied to, and the next open call of the same organization.

Skill names here are a verb in the infinitive followed by the entity, as `criar-habilidade` requires and ADR 0013 keeps. The name describes the current scope, and renaming a skill is a breaking change. Three names were weighed:

- `acompanhar-inscricao` names the application the person already made. The next open call is not an application yet, so half the scope falls outside the name.
- `acompanhar-resultado-da-inscricao` covers only the selection result, the same half.
- `acompanhar-status-da-inscricao` collides with `definir-inscricao`, which writes the status of a registration. The name would suggest that this skill writes it too, and it does not.

In Portuguese, "edital" is the public notice of a selection, and people also call their own application to it "o edital". The English counterpart is "open call". The English words for "inscrição" fail in this repository: "inscription" means engraved or written text, and "application", alone, reads first as a software application. "Submission" fits only a project sent to an open call. "Registration" fits what the other skills record, such as an exhibitor, a ticket, or a pre-registration at an event, where nobody is selected.

## Decision

The skill is `acompanhar-edital`. The entity it follows is the edital: the result of the one the person applied to and the next one of the same organization. "Edital" includes a call, a "chamada", a "convocatória", and the selection of a course, and the description names those words so the skill triggers on them.

English text about this skill, such as `FEATURES.md`, commits, and pull requests, says "open call", "selection result", "applicant", and "to apply". It does not use "inscription", nor "application" alone; when the noun cannot be avoided, it says "open-call application".

English text about `definir-inscricao` and `procurar-inscricao` says "registration", since what they record is an event registration.

The skill does not write the status of a registration. That stays in `definir-inscricao`, whose Portuguese name keeps "inscrição".

## Consequences

The name covers both halves of the work, and the boundary with `definir-inscricao` stays visible in the names.

A selection that is not an edital, such as a private course with an enrollment form, still uses this skill, through the description. If that becomes the common case, a rename is a breaking change: it needs a new record that supersedes this one, the old name in `metadata.aliases`, and a `BREAKING CHANGE:` footer.

The English entries of `FEATURES.md` that said "inscription" now say "registration".
