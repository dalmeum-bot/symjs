#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>
#include <Windows.h>

// 글자색 지정 함수
#define setColor(n) SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), n);
// 구분선 출력 함수
#define line(n) for (int i = 0; i < n; i++) printf("─");
// 색 지정과 출력을 동시에 하는 함수
#define printc(colorcode, str) setColor(colorcode); printf(str);
// 색 지정과 입력을 동시에 하는 함수
#define scanc(colorcode, str) setColor(colorcode); gets(str);

// 색상 코드 상수
typedef enum color {
    BLACK = 0,
    DARK_BLUE,
    DARK_GREEN,
    DARK_CYAN,
    RED,
    DARK_VIOLET,
    YELLOW,
    WHITE,
    GRAY,
    BLUE,
    GREEN,
    CYAN,
    LIGHT_RED,
    LIGHT_VIOLET,
    LIGHT_YELLOW,
    BOLD_WHITE
} color;

// 모든 배열의 기본 크기
#define DEFAULT 500

// 문자열 배열 구조체
typedef struct strs {
    char str[DEFAULT];
} strs;

typedef struct history {
    float caled;
    char formula[DEFAULT];
    bool success;
    char mode[10];
} history;

typedef struct memory {
    float value;
    char alphabet[DEFAULT];
} memory;

// -STACK-------------------------------

// stack의 기본 크기
#define STACK_SIZE 256
char stack[STACK_SIZE];
int idx = -1;   // top의 품번

// stack push
void push(char x) {
    if (idx >= STACK_SIZE) {
        printf("스택 오버플로우");
    }
    else stack[++idx] = x;
}

// stack pop
char pop() {
    if (idx <= -1) {
        printf("스택이 비었습니다");
        return -1;
    }
    return stack[idx--];
}

// stack top
char top() {
    if (idx <= -1) {
        return -1;
    }
    return stack[idx];
}

// stack reset
void reset_stack() {
    idx = -1;
}

// stack is empty
bool is_empty() {
    return idx == -1;
}

// -FUNCTION-------------------------------

// 연산자인지 (+-*/%) 판별
bool is_operator(char x) {
    return (x == '+' || x == '-' || x == '*' || x == '/' || x == '%');
}

// 숫자인지 (0~9.) 판별
bool is_num(char x) {
    return ('0' <= x && x <= '9') || (x == '.');
}

// 연산자 우선순위 반환
int get_priority(char op) {
    switch (op) {
    case '+':
    case '-':
        return 0;
    case '*':
    case '/':
    case '%':
        return 1;
    default:
        return -1;
    }
}

// 문자열에서 문자 제거
void delete(strs strs[], int idx, int len) {
    for (int i = idx; i < len; i++) {
        strcpy(strs[i].str, strs[i + 1].str);
    }
}

// 문자열에 문자 삽입
void insert(char ret[], char buf[], char t[], int idx) {
    strncpy(ret, buf, idx);
    ret[idx] = '\0';
    strcat(ret, t);
    strcat(ret, buf + idx);
}

// 커서 위치 반환
int getCursorPosition() {
    CONSOLE_SCREEN_BUFFER_INFO buff_info;
    GetConsoleScreenBufferInfo(GetStdHandle(STD_OUTPUT_HANDLE), &buff_info);
    return buff_info.dwCursorPosition.Y;
}

// 커서 위치 이동
void gotoxy(int x, int y) {
    COORD pos = { x, y };
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), pos);
}

// 가운데 정렬
void center(char str[]) {
    int x = (120 - strlen(str)) / 2;
    int y = getCursorPosition();
    gotoxy(x, y);
    printf("%s", str);
    /*if (strchr(str, '\n') == NULL) printf("\n");*/
}

// 문자 전부 치환
char* replace_all(char* s, const char* olds, const char* news) {
    char* result, * sr;
    size_t i, count = 0;
    size_t oldlen = strlen(olds); if (oldlen < 1) return s;
    size_t newlen = strlen(news);


    if (newlen != oldlen) {
        for (i = 0; s[i] != '\0';) {
            if (memcmp(&s[i], olds, oldlen) == 0) count++, i += oldlen;
            else i++;
        }
    }
    else i = strlen(s);


    result = (char*)malloc(i + 1 + count * (newlen - oldlen));
    if (result == NULL) return NULL;


    sr = result;
    while (*s) {
        if (memcmp(s, olds, oldlen) == 0) {
            memcpy(sr, news, newlen);
            sr += newlen;
            s += oldlen;
        }
        else *sr++ = *s++;
    }
    *sr = '\0';

    return result;
}

// 문자열 공백 제거
char* delete_space(char s[])
{
    char* str = (char*)malloc(sizeof(s));
    int i, k = 0;

    for (i = 0; i < strlen(s); i++)
        if (s[i] != ' ') str[k++] = s[i];

    str[k] = '\0';
    return str;
}

// 중위표기식 -> 후위표기식 변환
bool postfix(char formula[], char ret[]);

// 후위표기식 계산
bool calculate(char postfixed[], float *ret);

// 문자열 일치
bool is(char str1[], char str2[]) {
    return strcmp(str1, str2) == 0;
}

void input(int *count) {
    setColor(LIGHT_RED);
    printf("In [%d]: ", ++*count);
    setColor(WHITE);
}

void output(int *count) {
    setColor(DARK_CYAN);
    printf("Out[%d]: ", *count);
    setColor(WHITE);
}

void show_title_menu() {
    // title
    center("   ___ __ _| | ___ _   _| | __ _| |_ ___  _ __ \n");
    center("  / __/ _` | |/ __| | | | |/ _` | __/ _ \\| '__/\n");
    center(" | (_| (_| | | (__| |_| | | (_| | || (_) | |   \n");
    center("  \\___\\__,_|_|\\___|\\__,_|_|\\__,_|\\__\\___/|_|   \n");

    // menu bar
    printc(GRAY, "\n");
    center("------------------------------------------\n");
    center("| history | help | store | consts | quit |\n");
    center("------------------------------------------\n");
}

// -MAIN------------------------------

int main() {
    // 콘솔 title 지정
    system("title calculator");

    show_title_menu();

    char formula[DEFAULT] = { '\0' };   // 수식 저장할 문자열
    char postfixed[DEFAULT] = { '\0' };     // 후위표기식 저장할 문자열
    float ret = 0; // 계산 결과
    int count = 0;  // 사용 횟수

    history histories[DEFAULT]; // 계산 결과 모음
    memory mem[DEFAULT];
    int mem_idx = 0;

    while (true) {
        strcpy(formula, "");
        strcpy(postfixed, "");
        ret = 0;
        fflush(stdin);

        // 수식 입력받기
        input(&count);
        setColor(WHITE);
        gets(formula);

        // 공백 제거 및 기록 저장
        strcpy(formula, delete_space(formula));
        strcpy(histories[count].formula, formula);
        
        // 화면 초기화
        system("cls");
        show_title_menu();
        output(&count);

        // 명령어가 quit라면
        if (is(formula, "quit")) {
            printc(WHITE, "quited succesfully.\n\n");
            setColor(BLACK);

            break;
        }
        // 명령어가 help라면
        else if (is(formula, "help")) {
            strcpy(histories[count].mode, formula);

            printf("\n");
            printc(GRAY,
                "\n──────────────────────────────────────────────\
                 \nhistory | show history of calulation.\
                 \nstore   | store user-entered constants.\
                 \nconsts  | show all constants.\
                 \nhelp    │ show command help page.\
                 \nquit    │ quit program.\
                 \n──────────────────────────────────────────────\n\n"
            );

            continue;
        }
        // 명령어가 store라면
        else if (is(formula, "store")) {
            strcpy(histories[count].mode, formula);

            printf("\n");

            printc(WHITE, "\nenter alphabet\n");
            setColor(CYAN);
            scanf("%s", mem[mem_idx].alphabet);

            fflush(stdin);

            printc(WHITE, "\nenter value\n");
            setColor(YELLOW);
            scanf("%f", &mem[mem_idx].value);

            setColor(BLUE);
            printf("\n%f", mem[mem_idx].value);
            printc(GRAY, " is stored in ");
            setColor(BLUE);
            printf("%s", mem[mem_idx].alphabet);

            printc(WHITE, "\n");
            mem_idx++;

            continue;
        }
        // 명령어가 history라면
        else if (is(formula, "history")) {
            strcpy(histories[count].mode, formula);

            printf("\n");
            for (int i = 1; i < count; i++) {
                setColor(GRAY);
                printf("\nIn [%d]: %s\n", i, histories[i].formula);
                setColor(WHITE);
                printf("Out[%d]: ", i);
                if (!is(histories[i].mode, "calculate"))
                    printf("(%s object)\n", histories[i].mode);
                else if (histories[i].success)
                    printf("%.2lf\n", histories[i].caled);
                else
                    printf("error\n");
            }

            if (count == 1) {
                printc(WHITE, "\nno histories yet\n");
            }

            printf("\n");

            continue;
        }
        // 명령어가 consts라면
        else if (is(formula, "consts")) {
            strcpy(histories[count].mode, formula);

            printf("\n\n");

            for (int i = 0; i < mem_idx; i++) {
                setColor(CYAN);
                printf("%s", mem[i].alphabet);
                setColor(WHITE);
                printf(" := ");
                setColor(YELLOW);
                printf("%f\n", mem[i].value);
            }

            printf("\n");

            continue;
        }
        // 명령어가 수식 계산이라면
        else {
            strcpy(histories[count].mode, "calculate");

            // 후위표기식으로 변환
            bool postfix_success = postfix(formula, postfixed);
            if (!postfix_success) {
                histories[count].success = false;
                histories[count].caled = 0;

                continue;
            }

            // 후위표기식 계산
            printc(GRAY, "\n");
            bool calculate_success = calculate(postfixed, &ret);

            // 기록 저장
            histories[count].success = calculate_success;
            histories[count].caled = ret;

            printc(WHITE, "\n");
        }
    }

    return 0;
}

// 중위표기식 -> 후위표기식 변환 함수
bool postfix(char x[], char ret[]) {
    char formula[DEFAULT];  // 수식 문자열
    strcpy(formula, x);

    // 곱하기 생략 보정
    // 머리 아파서 단순하고 느리지만 확실한 방법으로 파훼함, 어차피 시간제한은 없음
    strcpy(formula, replace_all(formula, ")(", ")*("));
    strcpy(formula, replace_all(formula, "-(", "-1*("));
    strcpy(formula, replace_all(formula, "0(", "0*("));
    strcpy(formula, replace_all(formula, "1(", "1*("));
    strcpy(formula, replace_all(formula, "2(", "2*("));
    strcpy(formula, replace_all(formula, "3(", "3*("));
    strcpy(formula, replace_all(formula, "4(", "4*("));
    strcpy(formula, replace_all(formula, "5(", "5*("));
    strcpy(formula, replace_all(formula, "6(", "6*("));
    strcpy(formula, replace_all(formula, "7(", "7*("));
    strcpy(formula, replace_all(formula, "8(", "8*("));
    strcpy(formula, replace_all(formula, "9(", "9*("));

    // 보정 후 문자열 출력
    if (!is(x, formula)) {  // 원본 수식이랑 보정된 수식이 같지 않다면 이러이러하게 해석되었다고 알려주는 코드
        printc(BLUE, "interpreted to ");
    }
    setColor(WHITE);
    printf("%s\n", formula);

    // 초기화
    char p; // formula[i] 쓰기 귀찮아서 만든 변수
    int ret_idx = 0; // ret 문자열의 끝 품번
    int i = 0;  // formula 문자열의 품번
    int oper_count = 0; // 연산자 개수
    int num_count = 0;  // 피연산자(수) 개수
    reset_stack(); // 스택 비우기

    for (; i < strlen(formula); i++) {
        p = formula[i];

        // 만약 검색된 문자가 피연산자(숫자) 라면
        if (is_num(p)) {
            ret[ret_idx++] = p; // 바로 후위표기식에 쓰기
            if (!is_num(formula[i + 1])) {  // 이게 수의 끝 숫자였다면 띄어쓰기 해주기
                ret[ret_idx++] = ' ';
                num_count++;
            }
        }

        // 만약 검색된 문자가 '(' 라면
        else if (p == '(') {
            push(p);    // 연산자 스택에 여는 괄호 push
        }

        // 만약 검색된 문자가 ')' 라면
        else if (p == ')') {
            // 연산자 스택의 top이 여는 괄호가 될 때까지 계속 pop하고 후위표기식에 쓰기
            while (top() != '(') {
                ret[ret_idx++] = pop();
                ret[ret_idx++] = ' ';
                oper_count++;
            }
            pop();
        }

        // 만약 검색된 문자가 연산자라면
        else if (is_operator(p)) {
            if (i == 0 && p == '+') {  // "+3"과 같이 '+'를 연산자로 보면 안되는 예외 경우 처리
                ret[ret_idx++] = p;
            }

            // "3*-3" or "-3" or "2*(-3)"과 같이 '-'를 연산자로 보면 안되는 예외 경우 처리
            else if (p == '-' && (i - 1 < 0 || is_operator(formula[i - 1]) || formula[i - 1] == '(')) {
                ret[ret_idx++] = p;
            }

            else {
                if (is_empty()) {   // 스택이 비어있으면 바로 연산자 스택에 push
                    push(p);
                }

                else {
                    // 연산자 스택의 top이 나보다 우선순위가 높으면
                    if (get_priority(p) <= get_priority(top())) {
                        // 스택이 비거나 나보다 우선순위가 낮아질 때까지 계속 pop하고 후위표기식에 쓰기
                        while (!is_empty() && get_priority(p) <= get_priority(top())) {
                            ret[ret_idx++] = pop();
                            ret[ret_idx++] = ' ';
                            oper_count++;
                        }
                        push(p);
                    }

                    else {  // 아니면 그냥 push
                        push(p);
                    }
                }
            }
        }

        else {  // 연산자도, 피연산자도, 괄호도 아니면 오류
            printc(RED, "\nerror ");
            printc(GRAY, "unknown character\n");
            printc(WHITE, "\n");
            return false;
        }
    }

    // 스택에 남아있는 연산자 전부 pop하고 후위표기식에 쓰기
    while (!is_empty()) {
        ret[ret_idx++] = pop();
        ret[ret_idx++] = ' ';
        i++;
        oper_count++;
    }

    // 문자열 끝은 NULL로 끝내기
    ret[ret_idx - 1] = 0;

    // 연산자 개수가 피연산자 개수-1 과 같지 않다면 오류 (3+2+2 처럼 정상적인 수식이라면 연산자 개수 == 피연산자 개수-1)
    if (oper_count != num_count - 1) {
        printc(RED, "\nerror ");
        printc(GRAY, "too many operators\n"); // 피연산자가 연산자보다 많아질 수는 없음 -> 피연산자는 길게 써도 하나기 때문에 (3 3 3 3 3 -> 33333)
        printc(WHITE, "\n");
        return false;
    }

    return true;
}

bool calculate(char postfixed[], float *ret) {
    int step = 0;

    strs ctx[DEFAULT];
    int len = 0;

    char* ptr = strtok(postfixed, " ");
    while (ptr != NULL) {
        strcpy(ctx[len++].str, ptr);
        ptr = strtok(NULL, " ");
    }

    char p[DEFAULT] = "";
    float a, b;
    float result;
    char resultString[DEFAULT] = "";

    /*for (int i = 0; i < len; i++) {
        printf("%s ", ctx[i].str);
    }*/

    if (len == 1) {
        setColor(GRAY);
        printf("%.2lf = ", atof(ctx[0].str));
        setColor(YELLOW);
        printf("%.2lf\n", atof(ctx[0].str));
    }

    for (int i = 0; i < len; i++) {
        strcpy(p, ctx[i].str);

        if (is_operator(p[0]) && strlen(p) == 1) {
            a = atof(ctx[i - 2].str);
            b = atof(ctx[i - 1].str);

            if (p[0] == '+') result = a + b;
            else if (p[0] == '-') result = a - b;
            else if (p[0] == '*') result = a * b;
            else if (p[0] == '/') {
                if (b == 0) {
                    setColor(RED);
                    printf("error ");
                    setColor(GRAY);
                    printf("divide by zero\n");
                    return false;
                }
                result = a / b;
            }
            else if (p[0] == '%') result = a - b * floor(a / b);
            else if (p[0] == '^') {
                for (int j = len - 1; j >= i; j--) {
                    if (ctx[j].str == '^') {
                        a = atof(ctx[j - 2].str);
                        b = atof(ctx[j - 1].str);
                        result = pow(a, b);
                    }
                }
            }

            /*setColor(BLUE);
            printf("%d. ", ++step);*/
            setColor(GRAY);
            printf("%.2lf %c %.2lf = ", a, p[0], b);
            if (i == len - 1) setColor(YELLOW);
            printf("%.2lf\n", result);
            setColor(GRAY);

            delete(ctx, i - 2, len);
            i--; len--;
            delete(ctx, i - 1, len);
            i--; len--;

            snprintf(resultString, sizeof(resultString), "%f", result);
            strcpy(ctx[i].str, resultString);

            /*printf("\n");
            for (int i = 0; i < len; i++) {
                printf("%s ", ctx[i].str);
            }*/
        }
    }

    *ret = atof(ctx[0].str);

    return true;
}

void analyse(float n) {
    /*
    * 약수
    * 소인수분해
    * 이진수
    * 16진수
    *
    */

    if (n - (n / 1) == 0) {

    }
    else {

    }
}