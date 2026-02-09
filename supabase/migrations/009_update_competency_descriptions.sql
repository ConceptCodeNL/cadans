-- Update default competency descriptions with detailed rubric information
-- These descriptions are shown in an accordion dropdown per competency in the meeting grading view

UPDATE competency_templates
SET description = 'WAT & WAAROM
• Student geeft de context van de opdracht aan, waarbij probleem en/of aanleiding, doel, stakeholders en scope duidelijk worden
• Student beschrijft de beoogde deliverables (producten, handelingen) van de opdracht
• Student neemt hierbij (zoals stakeholders, deliverables) zowel school als bedrijf mee, in de juiste balans.

HOE
• Student bepaalt fasen en activiteiten bij de opdracht, verwerkt deze in een realistische planning, en bepaalt relevante risico''s en bijpassende maatregelen
• Student onderbouwt de gekozen aanpak (methoden & technieken), welke past bij doel en context van de opdracht
• Student werkt volgens het PvA en wijkt hier in overleg vanaf waar nodig.

MATE VAN ZELFSTANDIGHEID
• Student(en) komt/komen zelfstandig tot een bruikbaar (samenhangend, volledig en van voldoende kwaliteit) Plan van Aanpak.'
WHERE name = 'Working according a plan' AND is_system_default = TRUE;

UPDATE competency_templates
SET description = 'WAT & WAAROM
• Student analyseert het probleem grondig en identificeert de kernvraagstukken
• Student ontwerpt en bouwt een passende softwareoplossing

HOE
• Student past geschikte methoden, technieken en tools toe bij het ontwikkelen van software
• Student test en valideert de oplossing systematisch
• Student documenteert technische keuzes en oplossingen

MATE VAN ZELFSTANDIGHEID
• Student lost technische problemen zelfstandig op en zoekt hulp wanneer nodig.'
WHERE name = 'Problem solving and building software' AND is_system_default = TRUE;

UPDATE competency_templates
SET description = 'WAT & WAAROM
• Student identificeert relevante onderzoeksvragen
• Student verzamelt en analyseert informatie uit betrouwbare bronnen

HOE
• Student past passende onderzoeksmethoden toe
• Student trekt onderbouwde conclusies uit het onderzoek
• Student vertaalt onderzoeksresultaten naar praktische toepassingen

MATE VAN ZELFSTANDIGHEID
• Student voert zelfstandig onderzoek uit en integreert bevindingen in het werk.'
WHERE name = 'Research' AND is_system_default = TRUE;

UPDATE competency_templates
SET description = 'WAT & WAAROM
• Student communiceert effectief met stakeholders (collega''s, opdrachtgever, begeleiders)
• Student werkt constructief samen in een team

HOE
• Student stemt verwachtingen af en houdt betrokkenen op de hoogte
• Student geeft en ontvangt feedback op een professionele manier
• Student past communicatiestijl aan op de doelgroep

MATE VAN ZELFSTANDIGHEID
• Student neemt initiatief in communicatie en samenwerking.'
WHERE name = 'Collaboration and communication' AND is_system_default = TRUE;

UPDATE competency_templates
SET description = 'WAT & WAAROM
• Student toont een professionele werkhouding
• Student reflecteert op eigen handelen en ontwikkeling

HOE
• Student is betrouwbaar, punctueel en neemt verantwoordelijkheid
• Student staat open voor feedback en past gedrag aan
• Student toont motivatie en betrokkenheid bij het werk

MATE VAN ZELFSTANDIGHEID
• Student handelt zelfstandig professioneel en vraagt proactief om feedback.'
WHERE name = 'Professional attitude' AND is_system_default = TRUE;


