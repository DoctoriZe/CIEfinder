// CIEfinder by DoctoriZe
// Dataset inicial de códigos CIE-9 (ICD-9-CM) y CIE-10 (ICD-10 / ICD-10-CM), bilingüe ES/EN.
// Este es un catálogo de partida con los códigos de uso más frecuente en consulta clínica.
// No es el catálogo oficial completo (que tiene decenas de miles de códigos).
// Desde Ajustes > Importar catálogo se puede cargar un archivo JSON con más códigos
// (por ejemplo, el catálogo completo publicado por la OMS, el CDC o el ministerio de salud local)
// sin perder los datos ya guardados (historial y favoritos).

const CIE_BASE_DATA = [
  // ---- Infecciosas y parasitarias ----
  { code: "A00", sys: "CIE10", es: "Cólera", en: "Cholera" },
  { code: "A01.0", sys: "CIE10", es: "Fiebre tifoidea", en: "Typhoid fever" },
  { code: "A09", sys: "CIE10", es: "Diarrea y gastroenteritis de presunto origen infeccioso", en: "Infectious gastroenteritis and colitis, unspecified" },
  { code: "A15", sys: "CIE10", es: "Tuberculosis respiratoria, confirmada bacteriológica e histológicamente", en: "Respiratory tuberculosis, bacteriologically confirmed" },
  { code: "A41.9", sys: "CIE10", es: "Sepsis, no especificada", en: "Sepsis, unspecified organism" },
  { code: "A90", sys: "CIE10", es: "Fiebre del dengue", en: "Dengue fever" },
  { code: "A91", sys: "CIE10", es: "Fiebre hemorrágica del dengue", en: "Dengue hemorrhagic fever" },
  { code: "B01.9", sys: "CIE10", es: "Varicela, sin complicaciones", en: "Varicella without complication" },
  { code: "B02.9", sys: "CIE10", es: "Herpes zóster, sin complicaciones", en: "Zoster without complications" },
  { code: "B05.9", sys: "CIE10", es: "Sarampión, sin complicaciones", en: "Measles without complication" },
  { code: "B15", sys: "CIE10", es: "Hepatitis aguda tipo A", en: "Acute hepatitis A" },
  { code: "B16", sys: "CIE10", es: "Hepatitis aguda tipo B", en: "Acute hepatitis B" },
  { code: "B18.2", sys: "CIE10", es: "Hepatitis viral crónica tipo C", en: "Chronic viral hepatitis C" },
  { code: "B20", sys: "CIE10", es: "Enfermedad por VIH", en: "HIV disease" },
  { code: "B34.9", sys: "CIE10", es: "Infección viral, no especificada", en: "Viral infection, unspecified" },
  { code: "B35.0", sys: "CIE10", es: "Tiña de la barba y del cuero cabelludo", en: "Tinea barbae and tinea capitis" },
  { code: "B37.0", sys: "CIE10", es: "Candidiasis estomatitis", en: "Candidal stomatitis" },
  { code: "B82.9", sys: "CIE10", es: "Parasitosis intestinal, no especificada", en: "Intestinal parasitism, unspecified" },
  { code: "001", sys: "CIE9", es: "Cólera", en: "Cholera" },
  { code: "042", sys: "CIE9", es: "Infección por VIH", en: "Human immunodeficiency virus infection" },
  { code: "070.30", sys: "CIE9", es: "Hepatitis viral B aguda, sin coma hepático", en: "Acute type B viral hepatitis without hepatic coma" },

  // ---- Neoplasias ----
  { code: "C34.9", sys: "CIE10", es: "Tumor maligno de bronquio o pulmón, no especificado", en: "Malignant neoplasm of bronchus or lung, unspecified" },
  { code: "C50.9", sys: "CIE10", es: "Tumor maligno de mama, no especificado", en: "Malignant neoplasm of breast, unspecified" },
  { code: "C53.9", sys: "CIE10", es: "Tumor maligno del cuello uterino, no especificado", en: "Malignant neoplasm of cervix uteri, unspecified" },
  { code: "C61", sys: "CIE10", es: "Tumor maligno de la próstata", en: "Malignant neoplasm of prostate" },
  { code: "C18.9", sys: "CIE10", es: "Tumor maligno del colon, no especificado", en: "Malignant neoplasm of colon, unspecified" },
  { code: "C16.9", sys: "CIE10", es: "Tumor maligno del estómago, no especificado", en: "Malignant neoplasm of stomach, unspecified" },
  { code: "C71.9", sys: "CIE10", es: "Tumor maligno del encéfalo, no especificado", en: "Malignant neoplasm of brain, unspecified" },
  { code: "C91.0", sys: "CIE10", es: "Leucemia linfoblástica aguda", en: "Acute lymphoblastic leukemia" },
  { code: "D50.9", sys: "CIE10", es: "Anemia por deficiencia de hierro, no especificada", en: "Iron deficiency anemia, unspecified" },
  { code: "D64.9", sys: "CIE10", es: "Anemia, no especificada", en: "Anemia, unspecified" },
  { code: "153.9", sys: "CIE9", es: "Neoplasia maligna de colon, sin otra especificación", en: "Malignant neoplasm of colon, unspecified site" },
  { code: "174.9", sys: "CIE9", es: "Neoplasia maligna de mama, no especificada", en: "Malignant neoplasm of breast, unspecified" },

  // ---- Endocrinas, nutricionales y metabólicas ----
  { code: "E10", sys: "CIE10", es: "Diabetes mellitus tipo 1", en: "Type 1 diabetes mellitus" },
  { code: "E11", sys: "CIE10", es: "Diabetes mellitus tipo 2", en: "Type 2 diabetes mellitus" },
  { code: "E11.9", sys: "CIE10", es: "Diabetes mellitus tipo 2, sin complicaciones", en: "Type 2 diabetes mellitus without complications" },
  { code: "E03.9", sys: "CIE10", es: "Hipotiroidismo, no especificado", en: "Hypothyroidism, unspecified" },
  { code: "E05.9", sys: "CIE10", es: "Tirotoxicosis, no especificada", en: "Thyrotoxicosis, unspecified" },
  { code: "E66.9", sys: "CIE10", es: "Obesidad, no especificada", en: "Obesity, unspecified" },
  { code: "E78.5", sys: "CIE10", es: "Hiperlipidemia, no especificada", en: "Hyperlipidemia, unspecified" },
  { code: "E86", sys: "CIE10", es: "Depleción del volumen (deshidratación)", en: "Volume depletion" },
  { code: "E87.6", sys: "CIE10", es: "Hipopotasemia", en: "Hypokalemia" },
  { code: "250.00", sys: "CIE9", es: "Diabetes mellitus tipo 2, sin mención de complicación", en: "Diabetes mellitus without mention of complication, type II" },
  { code: "244.9", sys: "CIE9", es: "Hipotiroidismo, no especificado", en: "Unspecified hypothyroidism" },
  { code: "278.00", sys: "CIE9", es: "Obesidad, no especificada", en: "Obesity, unspecified" },

  // ---- Trastornos mentales y del comportamiento ----
  { code: "F32.9", sys: "CIE10", es: "Episodio depresivo, no especificado", en: "Major depressive disorder, single episode, unspecified" },
  { code: "F33.9", sys: "CIE10", es: "Trastorno depresivo recurrente, no especificado", en: "Major depressive disorder, recurrent, unspecified" },
  { code: "F41.1", sys: "CIE10", es: "Trastorno de ansiedad generalizada", en: "Generalized anxiety disorder" },
  { code: "F41.9", sys: "CIE10", es: "Trastorno de ansiedad, no especificado", en: "Anxiety disorder, unspecified" },
  { code: "F20.9", sys: "CIE10", es: "Esquizofrenia, no especificada", en: "Schizophrenia, unspecified" },
  { code: "F31.9", sys: "CIE10", es: "Trastorno afectivo bipolar, no especificado", en: "Bipolar disorder, unspecified" },
  { code: "F43.1", sys: "CIE10", es: "Trastorno de estrés postraumático", en: "Post-traumatic stress disorder" },
  { code: "F10.9", sys: "CIE10", es: "Trastornos mentales y del comportamiento por uso de alcohol", en: "Alcohol use disorder, unspecified" },
  { code: "F84.0", sys: "CIE10", es: "Autismo infantil", en: "Autistic disorder" },
  { code: "F90.9", sys: "CIE10", es: "Trastorno hiperquinético, no especificado (TDAH)", en: "Attention-deficit hyperactivity disorder, unspecified type" },
  { code: "296.20", sys: "CIE9", es: "Trastorno depresivo mayor, episodio único", en: "Major depressive disorder, single episode, unspecified" },
  { code: "300.00", sys: "CIE9", es: "Estado de ansiedad, no especificado", en: "Anxiety state, unspecified" },

  // ---- Sistema nervioso ----
  { code: "G40.9", sys: "CIE10", es: "Epilepsia, no especificada", en: "Epilepsy, unspecified" },
  { code: "G43.9", sys: "CIE10", es: "Migraña, no especificada", en: "Migraine, unspecified" },
  { code: "G20", sys: "CIE10", es: "Enfermedad de Parkinson", en: "Parkinson's disease" },
  { code: "G30.9", sys: "CIE10", es: "Enfermedad de Alzheimer, no especificada", en: "Alzheimer's disease, unspecified" },
  { code: "G35", sys: "CIE10", es: "Esclerosis múltiple", en: "Multiple sclerosis" },
  { code: "G47.00", sys: "CIE10", es: "Insomnio, no especificado", en: "Insomnia, unspecified" },
  { code: "G50.0", sys: "CIE10", es: "Neuralgia del trigémino", en: "Trigeminal neuralgia" },
  { code: "345.90", sys: "CIE9", es: "Epilepsia, no especificada, sin mención de intratabilidad", en: "Epilepsy, unspecified, without mention of intractable epilepsy" },
  { code: "346.90", sys: "CIE9", es: "Migraña, no especificada", en: "Migraine, unspecified" },

  // ---- Ojo y anexos / Oído ----
  { code: "H10.9", sys: "CIE10", es: "Conjuntivitis, no especificada", en: "Conjunctivitis, unspecified" },
  { code: "H25.9", sys: "CIE10", es: "Catarata senil, no especificada", en: "Age-related cataract, unspecified" },
  { code: "H40.9", sys: "CIE10", es: "Glaucoma, no especificado", en: "Glaucoma, unspecified" },
  { code: "H52.4", sys: "CIE10", es: "Presbicia", en: "Presbyopia" },
  { code: "H60.9", sys: "CIE10", es: "Otitis externa, no especificada", en: "Otitis externa, unspecified" },
  { code: "H66.9", sys: "CIE10", es: "Otitis media, no especificada", en: "Otitis media, unspecified" },
  { code: "H81.1", sys: "CIE10", es: "Vértigo posicional paroxístico benigno", en: "Benign paroxysmal vertigo" },
  { code: "H93.1", sys: "CIE10", es: "Tinnitus (acúfenos)", en: "Tinnitus" },

  // ---- Sistema circulatorio ----
  { code: "I10", sys: "CIE10", es: "Hipertensión esencial (primaria)", en: "Essential (primary) hypertension" },
  { code: "I21.9", sys: "CIE10", es: "Infarto agudo de miocardio, no especificado", en: "Acute myocardial infarction, unspecified" },
  { code: "I25.9", sys: "CIE10", es: "Enfermedad isquémica crónica del corazón, no especificada", en: "Chronic ischemic heart disease, unspecified" },
  { code: "I48.9", sys: "CIE10", es: "Fibrilación y flutter auricular, no especificado", en: "Atrial fibrillation and flutter, unspecified" },
  { code: "I50.9", sys: "CIE10", es: "Insuficiencia cardíaca, no especificada", en: "Heart failure, unspecified" },
  { code: "I63.9", sys: "CIE10", es: "Infarto cerebral, no especificado", en: "Cerebral infarction, unspecified" },
  { code: "I64", sys: "CIE10", es: "Accidente vascular encefálico agudo, no especificado como hemorrágico o isquémico", en: "Stroke, not specified as hemorrhage or infarction" },
  { code: "I80.9", sys: "CIE10", es: "Flebitis y tromboflebitis, no especificada", en: "Phlebitis and thrombophlebitis, unspecified" },
  { code: "I83.9", sys: "CIE10", es: "Várices de miembros inferiores, sin úlcera ni inflamación", en: "Varicose veins of lower extremities without ulcer or inflammation" },
  { code: "401.9", sys: "CIE9", es: "Hipertensión esencial, no especificada", en: "Unspecified essential hypertension" },
  { code: "410.90", sys: "CIE9", es: "Infarto agudo de miocardio, no especificado", en: "Acute myocardial infarction, unspecified site, episode of care unspecified" },
  { code: "428.0", sys: "CIE9", es: "Insuficiencia cardíaca congestiva, no especificada", en: "Congestive heart failure, unspecified" },

  // ---- Sistema respiratorio ----
  { code: "J00", sys: "CIE10", es: "Rinofaringitis aguda (resfriado común)", en: "Acute nasopharyngitis (common cold)" },
  { code: "J02.9", sys: "CIE10", es: "Faringitis aguda, no especificada", en: "Acute pharyngitis, unspecified" },
  { code: "J03.9", sys: "CIE10", es: "Amigdalitis aguda, no especificada", en: "Acute tonsillitis, unspecified" },
  { code: "J06.9", sys: "CIE10", es: "Infección aguda de las vías respiratorias superiores, no especificada", en: "Acute upper respiratory infection, unspecified" },
  { code: "J18.9", sys: "CIE10", es: "Neumonía, no especificada", en: "Pneumonia, unspecified organism" },
  { code: "J20.9", sys: "CIE10", es: "Bronquitis aguda, no especificada", en: "Acute bronchitis, unspecified" },
  { code: "J44.9", sys: "CIE10", es: "Enfermedad pulmonar obstructiva crónica, no especificada", en: "Chronic obstructive pulmonary disease, unspecified" },
  { code: "J45.9", sys: "CIE10", es: "Asma, no especificada", en: "Asthma, unspecified" },
  { code: "J30.4", sys: "CIE10", es: "Rinitis alérgica, no especificada", en: "Allergic rhinitis, unspecified" },
  { code: "J34.9", sys: "CIE10", es: "Trastorno de la nariz y de los senos paranasales, no especificado", en: "Disease of nose and nasal sinuses, unspecified" },
  { code: "460", sys: "CIE9", es: "Resfriado común", en: "Common cold" },
  { code: "486", sys: "CIE9", es: "Neumonía, organismo no especificado", en: "Pneumonia, organism unspecified" },
  { code: "493.90", sys: "CIE9", es: "Asma, no especificada", en: "Asthma, unspecified" },

  // ---- Sistema digestivo ----
  { code: "K02.9", sys: "CIE10", es: "Caries dental, no especificada", en: "Dental caries, unspecified" },
  { code: "K21.9", sys: "CIE10", es: "Enfermedad por reflujo gastroesofágico sin esofagitis", en: "Gastro-esophageal reflux disease without esophagitis" },
  { code: "K25.9", sys: "CIE10", es: "Úlcera gástrica, no especificada", en: "Gastric ulcer, unspecified" },
  { code: "K29.7", sys: "CIE10", es: "Gastritis, no especificada", en: "Gastritis, unspecified" },
  { code: "K35.80", sys: "CIE10", es: "Apendicitis aguda, no especificada", en: "Unspecified acute appendicitis" },
  { code: "K40.9", sys: "CIE10", es: "Hernia inguinal, no especificada", en: "Unspecified inguinal hernia" },
  { code: "K52.9", sys: "CIE10", es: "Gastroenteritis y colitis no infecciosa, no especificada", en: "Noninfective gastroenteritis and colitis, unspecified" },
  { code: "K59.0", sys: "CIE10", es: "Constipación (estreñimiento)", en: "Constipation" },
  { code: "K70.3", sys: "CIE10", es: "Cirrosis hepática alcohólica", en: "Alcoholic cirrhosis of liver" },
  { code: "K80.2", sys: "CIE10", es: "Cálculo de la vesícula biliar sin colecistitis", en: "Gallstone without cholecystitis" },
  { code: "533.90", sys: "CIE9", es: "Úlcera péptica de sitio no especificado", en: "Peptic ulcer of unspecified site, unspecified" },
  { code: "540.9", sys: "CIE9", es: "Apendicitis aguda, sin mención de peritonitis", en: "Acute appendicitis without mention of peritonitis" },

  // ---- Piel y tejido subcutáneo ----
  { code: "L20.9", sys: "CIE10", es: "Dermatitis atópica, no especificada", en: "Atopic dermatitis, unspecified" },
  { code: "L23.9", sys: "CIE10", es: "Dermatitis alérgica de contacto, causa no especificada", en: "Allergic contact dermatitis, unspecified cause" },
  { code: "L30.9", sys: "CIE10", es: "Dermatitis, no especificada", en: "Dermatitis, unspecified" },
  { code: "L40.9", sys: "CIE10", es: "Psoriasis, no especificada", en: "Psoriasis, unspecified" },
  { code: "L50.9", sys: "CIE10", es: "Urticaria, no especificada", en: "Urticaria, unspecified" },
  { code: "L70.9", sys: "CIE10", es: "Acné, no especificado", en: "Acne, unspecified" },
  { code: "L03.90", sys: "CIE10", es: "Celulitis, no especificada", en: "Cellulitis, unspecified" },

  // ---- Sistema osteomuscular ----
  { code: "M15.9", sys: "CIE10", es: "Poliartrosis, no especificada", en: "Polyosteoarthritis, unspecified" },
  { code: "M17.9", sys: "CIE10", es: "Gonartrosis (artrosis de la rodilla), no especificada", en: "Osteoarthritis of knee, unspecified" },
  { code: "M19.90", sys: "CIE10", es: "Artrosis, no especificada", en: "Osteoarthritis, unspecified site" },
  { code: "M25.50", sys: "CIE10", es: "Dolor en articulación, no especificado", en: "Pain in unspecified joint" },
  { code: "M54.5", sys: "CIE10", es: "Lumbago (dolor lumbar bajo)", en: "Low back pain" },
  { code: "M54.9", sys: "CIE10", es: "Dorsalgia, no especificada", en: "Dorsalgia, unspecified" },
  { code: "M06.9", sys: "CIE10", es: "Artritis reumatoide, no especificada", en: "Rheumatoid arthritis, unspecified" },
  { code: "M81.9", sys: "CIE10", es: "Osteoporosis, no especificada", en: "Osteoporosis, unspecified" },
  { code: "715.90", sys: "CIE9", es: "Osteoartrosis, sitio no especificado", en: "Osteoarthrosis, unspecified whether generalized or localized, site unspecified" },
  { code: "724.2", sys: "CIE9", es: "Lumbago", en: "Lumbago" },

  // ---- Genitourinario ----
  { code: "N18.9", sys: "CIE10", es: "Enfermedad renal crónica, no especificada", en: "Chronic kidney disease, unspecified" },
  { code: "N20.0", sys: "CIE10", es: "Cálculo del riñón", en: "Calculus of kidney" },
  { code: "N30.9", sys: "CIE10", es: "Cistitis, no especificada", en: "Cystitis, unspecified" },
  { code: "N39.0", sys: "CIE10", es: "Infección de vías urinarias, sitio no especificado", en: "Urinary tract infection, site not specified" },
  { code: "N40", sys: "CIE10", es: "Hiperplasia de la próstata", en: "Benign prostatic hyperplasia" },
  { code: "N76.0", sys: "CIE10", es: "Vaginitis aguda", en: "Acute vaginitis" },
  { code: "N92.6", sys: "CIE10", es: "Menstruación irregular, no especificada", en: "Irregular menstruation, unspecified" },
  { code: "599.0", sys: "CIE9", es: "Infección de vías urinarias, sitio no especificado", en: "Urinary tract infection, site not specified" },

  // ---- Embarazo, parto y puerperio ----
  { code: "O80", sys: "CIE10", es: "Parto único espontáneo", en: "Single spontaneous delivery" },
  { code: "O21.9", sys: "CIE10", es: "Vómitos del embarazo, no especificados", en: "Vomiting of pregnancy, unspecified" },
  { code: "O26.9", sys: "CIE10", es: "Afección relacionada con el embarazo, no especificada", en: "Pregnancy related condition, unspecified" },
  { code: "O14.9", sys: "CIE10", es: "Preeclampsia, no especificada", en: "Pre-eclampsia, unspecified" },
  { code: "Z34.9", sys: "CIE10", es: "Supervisión de embarazo normal, no especificada", en: "Supervision of normal pregnancy, unspecified" },

  // ---- Malformaciones congénitas ----
  { code: "Q21.0", sys: "CIE10", es: "Defecto del tabique ventricular", en: "Ventricular septal defect" },
  { code: "Q90.9", sys: "CIE10", es: "Síndrome de Down, no especificado", en: "Down syndrome, unspecified" },

  // ---- Síntomas, signos y hallazgos anormales ----
  { code: "R05", sys: "CIE10", es: "Tos", en: "Cough" },
  { code: "R06.02", sys: "CIE10", es: "Disnea (dificultad para respirar)", en: "Shortness of breath" },
  { code: "R07.9", sys: "CIE10", es: "Dolor en el pecho, no especificado", en: "Chest pain, unspecified" },
  { code: "R10.9", sys: "CIE10", es: "Dolor abdominal, no especificado", en: "Unspecified abdominal pain" },
  { code: "R11.0", sys: "CIE10", es: "Náusea", en: "Nausea" },
  { code: "R11.10", sys: "CIE10", es: "Vómito, no especificado", en: "Vomiting, unspecified" },
  { code: "R42", sys: "CIE10", es: "Mareo y desvanecimiento", en: "Dizziness and giddiness" },
  { code: "R50.9", sys: "CIE10", es: "Fiebre, no especificada", en: "Fever, unspecified" },
  { code: "R51", sys: "CIE10", es: "Cefalea", en: "Headache" },
  { code: "R53.83", sys: "CIE10", es: "Fatiga, no especificada", en: "Other fatigue" },
  { code: "R55", sys: "CIE10", es: "Síncope y colapso", en: "Syncope and collapse" },
  { code: "780.6", sys: "CIE9", es: "Fiebre", en: "Fever" },
  { code: "784.0", sys: "CIE9", es: "Cefalea", en: "Headache" },

  // ---- Traumatismos y causas externas ----
  { code: "S06.9", sys: "CIE10", es: "Traumatismo intracraneal, no especificado", en: "Unspecified intracranial injury" },
  { code: "S52.5", sys: "CIE10", es: "Fractura del extremo distal del radio", en: "Fracture of lower end of radius" },
  { code: "S72.0", sys: "CIE10", es: "Fractura del cuello del fémur", en: "Fracture of neck of femur" },
  { code: "S93.4", sys: "CIE10", es: "Esguince y torcedura del tobillo", en: "Sprain and strain of ankle" },
  { code: "T14.9", sys: "CIE10", es: "Traumatismo, no especificado", en: "Injury, unspecified" },
  { code: "T78.40", sys: "CIE10", es: "Alergia, no especificada", en: "Allergy, unspecified" },
  { code: "T78.2", sys: "CIE10", es: "Choque anafiláctico, no especificado", en: "Anaphylactic shock, unspecified" },
  { code: "805.4", sys: "CIE9", es: "Fractura cerrada de vértebra lumbar, sin lesión medular", en: "Closed fracture of lumbar vertebra without mention of spinal cord injury" },
  { code: "845.00", sys: "CIE9", es: "Esguince y torcedura del tobillo, no especificado", en: "Sprain of ankle, unspecified site" },

  // ---- Factores que influyen en el estado de salud (Z) ----
  { code: "Z00.0", sys: "CIE10", es: "Examen médico general", en: "General medical examination" },
  { code: "Z23", sys: "CIE10", es: "Necesidad de inmunización contra enfermedad bacteriana única", en: "Need for immunization" },
  { code: "Z71.3", sys: "CIE10", es: "Consulta para asesoramiento y vigilancia dietética", en: "Dietary counseling and surveillance" },
  { code: "Z76.0", sys: "CIE10", es: "Solicitud de repetición de prescripción", en: "Encounter for issue of repeat prescription" },
  { code: "Z96.6", sys: "CIE10", es: "Presencia de implantes articulares ortopédicos", en: "Presence of orthopedic joint implants" },

  // ---- COVID-19 ----
  { code: "U07.1", sys: "CIE10", es: "COVID-19", en: "COVID-19" },
  { code: "U09.9", sys: "CIE10", es: "Afección post COVID-19, no especificada", en: "Post COVID-19 condition, unspecified" }
];
