#include <stdio.h>
#include "exporter.h"
#include "asset.h"
#include "jumpgate_asset.h"
using namespace Exporter;

int main(void) {
    Init();

    IAsset* pAsset = new MockJumpgateAsset();    
    SaveAssetAsCollada(pAsset, L"mock_data.dae");

    Release();


    return 0;
}
