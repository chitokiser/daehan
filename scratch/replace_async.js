const fs = require('fs');
const path = require('path');

function replaceAsyncCalls(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert assignments from sync to await
    content = content.replace(/const users = getAllUsers\(\);/g, 'const users = await getAllUsers();');
    content = content.replace(/const stats = getAdminStats\(\);/g, 'const stats = await getAdminStats();');
    content = content.replace(/const result = updateUserRole\(/g, 'const result = await updateUserRole(');
    content = content.replace(/const result = updateUserBalance\(/g, 'const result = await updateUserBalance(');
    content = content.replace(/const user = getUserWallet\(/g, 'const user = await getUserWallet(');
    content = content.replace(/const wallet = getUserWallet\(/g, 'const wallet = await getUserWallet(');
    content = content.replace(/const result = registerOrLoginGoogleUser\(/g, 'const result = await registerOrLoginGoogleUser(');
    content = content.replace(/const recentOrders = getUserOrders\(/g, 'const recentOrders = await getUserOrders(');
    content = content.replace(/const recentTransactions = getUserTransactions\(/g, 'const recentTransactions = await getUserTransactions(');
    content = content.replace(/const result = executePayment\(/g, 'const result = await executePayment(');
    content = content.replace(/const result = faucetWallet\(/g, 'const result = await faucetWallet(');
    content = content.replace(/const verifyResult = verifyTransaction\(/g, 'const verifyResult = await verifyTransaction(');
    content = content.replace(/const result = convertPointsToKm\(/g, 'const result = await convertPointsToKm(');
    content = content.replace(/const orders = getAllOrders\(\);/g, 'const orders = await getAllOrders();');
    content = content.replace(/const result = updateOrderStatus\(/g, 'const result = await updateOrderStatus(');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated async calls in ' + filePath);
}

const routes = [
    'src/app/api/v1/admin/members/route.ts',
    'src/app/api/v1/admin/orders/route.ts',
    'src/app/api/v1/auth/google/route.ts',
    'src/app/api/v1/kmoa/pay/route.ts',
    'src/app/api/v1/kmoa/verify/route.ts',
    'src/app/api/v1/wallet/convert/route.ts',
    'src/app/api/v1/wallet/pay/route.ts',
    'src/app/api/v1/wallet/[uid]/route.ts'
];

routes.forEach(p => {
    if(fs.existsSync(p)) {
        replaceAsyncCalls(p);
    }
});

// Now replace kcaDb.ts with our firebase version
fs.copyFileSync('scratch/kcaDb_firebase.ts', 'src/lib/kcaDb.ts');
console.log('Replaced kcaDb.ts with Firebase version');
