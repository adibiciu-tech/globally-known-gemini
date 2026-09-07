"""Backend API tests for Color Vowel Chart app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vowel-chart-app.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---- Words endpoints ----
class TestWords:
    def test_random_word(self):
        r = requests.get(f"{API}/words/random", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("word", "stressedVowel", "vowelPosition", "colorCategory", "pronunciation", "definition"):
            assert k in data, f"missing {k} in {data}"
        assert isinstance(data["word"], str) and len(data["word"]) > 0
        assert "_id" not in data

    def test_random_word_variability(self):
        seen = set()
        for _ in range(8):
            r = requests.get(f"{API}/words/random", timeout=15)
            assert r.status_code == 200
            seen.add(r.json()["word"])
        # secrets.randbelow should still return variability
        assert len(seen) >= 2

    def test_analyze_known(self):
        r = requests.get(f"{API}/words/analyze/academic", timeout=15)
        assert r.status_code == 200, r.text
        assert r.json()["word"].lower() == "academic"

    def test_analyze_unknown(self):
        r = requests.get(f"{API}/words/analyze/zzznotawordzzz", timeout=15)
        assert r.status_code == 404

    def test_category_red_dress(self):
        r = requests.get(f"{API}/words/", params={"category": "RED DRESS"}, timeout=15)
        assert r.status_code == 200
        words = r.json()
        assert isinstance(words, list)
        assert len(words) > 0, "no words in RED DRESS category"
        for w in words:
            assert w["colorCategory"] == "RED DRESS"

    def test_no_red_pepper_category(self):
        r = requests.get(f"{API}/words/", params={"category": "RED PEPPER"}, timeout=15)
        assert r.status_code == 200
        assert r.json() == [], "RED PEPPER category should not exist anymore"


# ---- Savings endpoints ----
class TestSavings:
    def test_full_flow(self):
        # list existing
        r = requests.get(f"{API}/savings/lists", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

        # create
        list_name = "TEST_pytest_list"
        # cleanup: delete if exists
        for lst in r.json():
            if lst["name"] == list_name:
                requests.delete(f"{API}/savings/lists/{lst['id']}")

        c = requests.post(f"{API}/savings/lists", json={"name": list_name}, timeout=15)
        assert c.status_code == 200, c.text
        list_id = c.json()["id"]
        assert c.json()["name"] == list_name

        # add word
        a = requests.post(
            f"{API}/savings/lists/{list_id}/words",
            json={"word": "TEST_word", "colorCategory": "RED DRESS", "stressedVowel": "e", "definition": "test"},
            timeout=15,
        )
        assert a.status_code == 200, a.text

        # verify persisted
        g = requests.get(f"{API}/savings/lists/{list_id}", timeout=15)
        assert g.status_code == 200
        assert any(w["word"] == "TEST_word" for w in g.json()["words"])

        # remove word
        d = requests.delete(f"{API}/savings/lists/{list_id}/words/TEST_word", timeout=15)
        assert d.status_code == 200

        # verify removed
        g2 = requests.get(f"{API}/savings/lists/{list_id}", timeout=15)
        assert not any(w["word"] == "TEST_word" for w in g2.json()["words"])

        # delete list
        dl = requests.delete(f"{API}/savings/lists/{list_id}", timeout=15)
        assert dl.status_code == 200
