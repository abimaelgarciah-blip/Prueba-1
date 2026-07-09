-- ============================================================================
-- Esquema Oracle 11g para "Chequeo Medico" (equivalente a las tablas de
-- Supabase: medical_records, doctors) + tabla de imagenes predeterminadas
-- (equivalente a appDefaults/localStorage de la version JS).
--
-- Notas Oracle 11g:
--   * No existe tipo JSON nativo (llego en 12c) -> se usa CLOB y se valida/
--     serializa en la capa Java (ver JsonCodec, Gson).
--   * No existe IDENTITY (llego en 12c) -> se usan SEQUENCE + TRIGGER.
--   * VARCHAR2 maximo 4000 bytes en modo estandar; usar CLOB donde el texto
--     pueda exceder eso (firmas base64, imagenes base64, notas largas).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- MEDICAL_RECORDS  (equivalente a la tabla "medical_records" de Supabase)
--
-- El id se genera en la capa Java (UUID.randomUUID().toString(), 36
-- caracteres) en vez de usar RAW(16)/SYS_GUID(): simplifica el mapeo JDBC
-- (no hay que convertir RAW<->hex en cada consulta) y es igual de unico.
-- ----------------------------------------------------------------------------
CREATE TABLE medical_records (
  id            VARCHAR2(36)   PRIMARY KEY,
  patient_name  VARCHAR2(200),
  patient_id    VARCHAR2(100),
  study_date    DATE,
  clinic        VARCHAR2(200),
  -- JSON con TODOS los campos dinamicos de las 26+ hojas (equivalente a
  -- appState / la columna jsonb "data" de Supabase). Un registro por campo
  -- en columnas normalizadas no es viable: hay cientos de campos de texto
  -- libre por paciente y crecen con cada hoja nueva sin tocar el esquema.
  data          CLOB,
  created_at    TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at    TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL
);

ALTER TABLE medical_records ADD CONSTRAINT ck_medrec_data_json
  CHECK (data IS JSON) DISABLE; -- habilitar solo si la instancia es 12c+; en 11g queda deshabilitado a proposito.

CREATE INDEX ix_medrec_patient_name ON medical_records (patient_name);
CREATE INDEX ix_medrec_clinic       ON medical_records (clinic);
CREATE INDEX ix_medrec_updated_at   ON medical_records (updated_at);

CREATE OR REPLACE TRIGGER trg_medrec_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- ----------------------------------------------------------------------------
-- DOCTORS  (equivalente a la tabla "doctors" de Supabase)
-- ----------------------------------------------------------------------------
CREATE TABLE doctors (
  id               VARCHAR2(36) PRIMARY KEY,
  nombre           VARCHAR2(200) NOT NULL,
  cedula           VARCHAR2(100),
  especialidad     VARCHAR2(200),
  clinica          VARCHAR2(200),
  telefono         VARCHAR2(50),
  email            VARCHAR2(200),
  direccion        VARCHAR2(400),
  -- Firma capturada a mano (signature_pad) como PNG data URL (base64).
  signature_data   CLOB,
  -- Firma subida como imagen (JPEG/PNG) como data URL (base64).
  signature_image  CLOB,
  created_at       TIMESTAMP   DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX ix_doctors_nombre ON doctors (nombre);

-- ----------------------------------------------------------------------------
-- APP_DEFAULTS  (equivalente a appDefaults/localStorage de la vista Ajustes:
-- imagenes predeterminadas de portadas/membretes, compartidas por TODOS los
-- pacientes, salvo que el paciente suba su propia imagen en su hoja).
-- ----------------------------------------------------------------------------
CREATE TABLE app_defaults (
  image_key   VARCHAR2(50) PRIMARY KEY,   -- ej. 'cover-1', 'mb-7'
  image_data  CLOB,                       -- data URL base64 (image/jpeg)
  updated_at  TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- SEQUENCE de respaldo (no se usa con RAW(16)/SYS_GUID, se deja documentada
-- por si se prefiere PK numerica en vez de GUID en alguna instalacion):
-- CREATE SEQUENCE seq_medical_records START WITH 1 INCREMENT BY 1;
-- ----------------------------------------------------------------------------

COMMENT ON TABLE medical_records IS 'Expediente clinico por paciente (26+ hojas + evaluacion nutricional), 1 fila por paciente/estudio.';
COMMENT ON COLUMN medical_records.data IS 'JSON con todos los campos dinamicos de las hojas (clave=id de campo tal como en el HTML original, valor=texto/objeto).';
COMMENT ON TABLE doctors IS 'Perfiles de doctores y su firma digital, usados en la hoja de Sugerencias/Firma (c11-doc-*).';
COMMENT ON TABLE app_defaults IS 'Imagenes predeterminadas compartidas (portadas/membretes) configuradas en Ajustes.';
