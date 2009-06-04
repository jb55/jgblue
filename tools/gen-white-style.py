import re

replacements = (
	("#0d151b", "#dae8f0"), # bg color
	("#eee", "#222"),
	("bg-fade.png", "bg-fade-w.png"),
)
	

def main():
	file = open("../static/css/style.css", "r")
	contents = file.read()
	file.close()
	
	file_white = open("../static/css/style-white.css", "w")
	
	for item in replacements:
		contents = re.sub(item[0], item[1], contents)
		
	file_white.write(contents)
	file_white.close()

if __name__ == "__main__":
	main()
