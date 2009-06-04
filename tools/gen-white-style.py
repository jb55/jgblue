import re

color_replacements = (
	("#0d151b", "#e8f0f4"), # bg color
	("#eee", "#111"),
)
	

def main():
	file = open("../static/css/style.css", "r")
	contents = file.read()
	file.close()
	
	file_white = open("../static/css/style-white.css", "w")
	
	for color in color_replacements:
		contents = re.sub(color[0], color[1], contents)
		
	file_white.write(contents)
	file_white.close()

if __name__ == "__main__":
	main()