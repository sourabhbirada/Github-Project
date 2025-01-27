#include <iostream>
using namespace std;

void recursiveFunction(int n) {
    if (n > 0) {  
        cout << n << endl;  
        recursiveFunction(n - 1);  
    }
    
}

int main() {
    int start = 5;  
    recursiveFunction(start);
    return 0;
}
