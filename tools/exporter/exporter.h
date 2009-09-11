#ifndef _H_EXPORTER_
#define _H_EXPORTER_

#include <string>

namespace Exporter {

class IAsset;

void Init();
void Release();

bool SaveAssetAsCollada(IAsset* pAsset, std::wstring filename);

void SaveTest();

}

#endif
