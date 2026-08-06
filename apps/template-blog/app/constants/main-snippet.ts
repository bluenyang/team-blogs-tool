// 스니펫 목록
export const originalSnippets: string[] = [
  "console.log('Hello World!'); //JavaScript ", // JavaScript
  'printf("Hello World!"); //C ', // C
  'std::cout << "Hello World!" << std::endl; //C++ ', // C++
  'Console.WriteLine("Hello World!"); //C# ', // C#
  'fmt.Println("Hello World!") //Go ', // Go
  'System.out.println("Hello World!"); //Java ', // Java
  'println("Hello World!") //Kotlin ', // Kotlin
  'print("Hello World!") #Python ', // Python
  'echo "Hello World!" #Linux-Shell ', // ShellScript
];

// 스니펫 출력 속도
export const initTypingSpeed: number = 80;
export const initDeletingSpeed: number = 40;
export const waitTimeToDelete: number = 3000;
