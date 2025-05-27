#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

string hasTwoSum(vector<int>& nums, int target) {
    unordered_set<int> seen;
    
    for (int num : nums) {
        int complement = target - num;
        
        if (seen.find(complement) != seen.end()) {
            return "YES";
        }
        
        seen.insert(num);
    }
    
    return "NO";
}
int main() {
    int n, target;
    
    cin >> n;
    cin >> target;
    
    vector<int> nums(n);
    
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
   
    
    string result = hasTwoSum(nums, target);
    
    cout << result << endl;
    
   
}




                             
