# CTPA-DOT implementation notes

CTPA-DOT is the parent management portal. Managed Employers are provisioned to the Employer portal matching their primary DOT agency. Employers can manage company contacts, staff users, and covered workers. Worker records can now reference the normalized `dot_agency_positions` catalog.

FMCSA keeps the existing Employer-DOT -> Employee-DOT / Driver-DOT model. FAA, FRA, FTA, PHMSA, and USCG use newly created agency Employer-DOT -> Employee-DOT child portal pairs.
