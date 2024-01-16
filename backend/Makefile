PYTHON_VERSION = 3
VENV_NAME = .venv
VENV_ACTIVATE = . $(VENV_NAME)/bin/activate

venv:
	python$(PYTHON_VERSION) -m venv $(VENV_NAME)

install:
	$(VENV_ACTIVATE) && pip install -r requirements.txt

setup: venv install

run:
	$(VENV_ACTIVATE) && python -m app.main
