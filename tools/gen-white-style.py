import re

replacements = (
	("#0d151b", "#e8eff4"),				# bg color
	("#eee", "#222"),					# text color
	("bg-fade.png", "bg-fade-w.png"),	# bg fade img
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
