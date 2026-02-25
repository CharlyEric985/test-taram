-- =========================
-- TEST BACKEND SECURISE
-- =========================

-- Promouvoir un utilisateur en agent
update profiles
set role = 'agent'
where id = '41dc57ec-350f-4788-a67c-212813cd1337';

-- =========================
-- TEST 1 — Client tente insert (DOIT ÉCHOUER)
-- =========================
-- Client : bc601089-fd22-49f0-ac0e-b2654971f5bc
set request.jwt.claim.sub = 'bc601089-fd22-49f0-ac0e-b2654971f5bc';

-- Tentative directe (ne devrait jamais passer)
-- ATTENTION : Avec la fonction sécurisée, il faut utiliser RPC
-- Cette insertion doit renvoyer une ERREUR RLS
insert into properties (title, price, city, agent_id)
values ('Test client', 1000, 'Tana', 'bc601089-fd22-49f0-ac0e-b2654971f5bc');

-- =========================
-- TEST 2 — Agent insert via RPC (DOIT MARCHER)
-- =========================
set request.jwt.claim.sub = '41dc57ec-350f-4788-a67c-212813cd1337';

-- Utilisation de la fonction sécurisée insert_property
select public.insert_property(
  'Maison luxe', 
  'Bel appartement avec vue', 
  200000, 
  'Tana'
);

-- =========================
-- TEST 3 — Client SELECT
-- =========================
set request.jwt.claim.sub = 'bc601089-fd22-49f0-ac0e-b2654971f5bc';

-- Le client ne doit voir que les propriétés publiées
select * from properties;

-- =========================
-- TEST 4 — Publier le bien de l'agent
-- =========================
set request.jwt.claim.sub = '41dc57ec-350f-4788-a67c-212813cd1337';

update properties
set is_published = true
where agent_id = auth.uid();

-- =========================
-- TEST 5 — Client SELECT après publication
set request.jwt.claim.sub = 'bc601089-fd22-49f0-ac0e-b2654971f5bc';

-- Maintenant le client peut voir les biens publiés
select * from properties;
