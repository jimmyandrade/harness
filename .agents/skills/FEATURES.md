---
locale: en
---

# Skills

How these skills relate is in `README.md`, in this folder.

## Features

### definir-vocabulario
- **Stability**: experimental
- **Description**: Register and update one or more voice-vocabulary terms
- **Properties**:
  - Lives at `.agents/skills/definir-vocabulario/SKILL.md`
  - Registers and updates allowed, forbidden, and situational terms for one language
  - Keeps the category an English word in every language, and keeps the term and the notes in that language
  - Reads the brand sources named in the project instructions before answering or writing. An ambiguous channel, audience, line, commercial intent, or situation waits for a question
  - Keeps a term that only fits one context as situationally allowed, with when. allowed and forbidden stay general rules
  - Adds tags to a situational term of one speaker, event, or channel, reusing a tag already in the glossary, and keeps when as the rule in words
  - Marks a name whose casing is part of the spelling with case_sensitive, so the write keeps its casing
  - Uses insert when the person is registering and does not name a mode, update when an existing term changes, and upsert when the batch does both
  - Reads and writes with `node node_modules/vocabulary/dist/cli.js lookup`, `exists`, and `terms` when there is a terminal, and with the MCP tools `lookup_term`, `exists_in_text`, and `write_terms` when there is not
  - Stops without a terminal and without the MCP server, as in a Notion agent
  - Leaves writing brand text to redigir-com-tom-de-voz, and does not invent a term
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing or approving brand text, classifying a phrase, and inventing a term

### redigir-com-tom-de-voz
- **Stability**: experimental
- **Description**: Write, suggest, review, and rewrite brand text in the project's voice
- **Properties**:
  - Lives at `.agents/skills/redigir-com-tom-de-voz/SKILL.md`
  - Writes in the voice of the project that is open and reads that project's glossary, with `node node_modules/vocabulary/dist/cli.js lookup` and `exists` when there is a terminal and the CLI is installed, and with the MCP tools when there is no terminal or the CLI is not available
  - Without a terminal and without the MCP server, as in a Notion agent, reads the glossary only from a source the project instructions name, or stops
  - Reads the glossary with the tags of the speaker, the event, and the channel of the text, so a term of another context stays out
  - Writes the stored spelling of a case-sensitive term when a read reports case_matches false
  - Waits for context, channel, audience, the brand sources named in the project instructions, the glossary, and the creative intent
  - Keeps out a forbidden term, a generic phrase, AI-sounding text, and language the glossary marks as misaligned
  - Treats an emoji as a glossary term. Without a row, the copy waits
  - Replaces a cliché with the image, scene, action, effect, or situation in its description, and leaves rejected phrases out
  - Sends term registration to definir-vocabulario
  - Writes an external event title when the person asks, keeps the canonical name they already gave, and does not write the calendar event or lock the spelling
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses answering the person chatting with the AI, locking spelling, changing a content format, and assuming a customer, a piece, an opportunity, or commercial history
