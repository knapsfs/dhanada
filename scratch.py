import re

major = re.compile(r"(MAJOR|BREAKING CHANGE|!:)")
minor = re.compile(r"(MINOR|feat:|feat\()")

commits = [
	"feat: add feature",
	"feat(auth): add auth",
	"fix: fix bug",
	"fix!: breaking fix",
	"feat(ui)!: breaking feature",
	"chore: update deps",
	"MAJOR: breaking",
	"MINOR: small addition",
]

for c in commits:
	is_major = major.search(c) is not None
	is_minor = minor.search(c) is not None
	print(f"'{c}' -> MAJOR: {is_major}, MINOR: {is_minor}")
