export const usdtVault = {
  token: 'EQDNV0ZN6CjrbHg4VCCLvK5hYyGBbzPsZ27wOnGO7Waeni_g',
  pool: 'EQAF7RbPQogEsv_SNowdVkB4pMKC5e4zjUEjXtAnHG-nYyv_',
  dedustJettonVault: 'EQDd3VX6lLLscxgrBscm066Grw8hak0xhXBE1LehzjnkK_nB',
  dedustDistributionWallet: 'EQAV_1KJ7vffUOGRi1npXlYL7k3xasr_rltgeTudM5dWz_BH',
  distributionPool: 'EQBvE1AMR_dXObDINwg4AadqGnnQATC1c3rKWix2wiDb9MQl',
  strategy: 'EQBHEIJG62m_YBgGbMS3_DqjQIy58kgp0bK58vQFO5qLqxOY',
  vault: 'EQAibYv9e0cJWUUV6BItCg7DHHKTZ05V9p_vYKFiM4pLxgGZ',
  extraDistributionWallet: 'EQAtDCsfiaDQEb1ZnplSkw2hKMr0fgo8YBqvTK28CNc1Pbkl',
  extraDistributionPool: 'EQCgguh-Jl2aD905sbxc_KrZPx2iJ7BuEqC7iQ4rkAQmUxCq'
}

const scaleVault = {
  token: 'EQBIwRtXmqHijQYlZ-RqNEGa5j81Tahw50p5_yG7Esyhy0lx',
  pool: 'EQDftWhhTNTWDTz-7R-1rAU0YTEiUJwecKvcqM2pIOTu1kT1',
  dedustJettonVault: 'EQD2ZbivUkmgsE9-Zr_4vEfbObxzvD3hw2s_KqXjBfrymxxX',
  dedustDistributionWallet: 'EQBj6I8vukfL9Kf6cMt6N_SdV8s_xwM7HeOwXRSQkOmkjLyP',
  distributionPool: 'EQBUIz5TRQ74YXw5OaWO-NNOEumgZDVexIInnWJCZJ9plFU2',
  strategy: 'EQC-gW--pXsl3dGBtw4XqiE3bDK3G6g09fc3Gm6dks70vYwm',
  vault: 'EQBg6jLj_pzpTD4fFDZcE8mSJ74I7-6F8LDMeDxUPBuCnIOB',
  extraDistributionWallet: 'EQAVtK_Ehd9U2BoFbKsdtJ88j82xJB28jRzVSHP27LeIBLG6',
  extraDistributionPool: 'EQCBWlGoVd8w4riZ6dLqqKT1GqgM3C-PwI_54XHLL_sRPNM-'
}

const notVault = {
  token: 'EQAy_Ma3cBGevn5e9DMFOIXq6qigpvhs3HpX8pxn38r6IrpQ',
  pool: 'EQAUK_p5nLKILbe-aOpJQsZahHcIiqPpoRhrPGMm8trRjCWI',
  dedustJettonVault: 'EQBI1GMtb7ounGdLxtIfVyxKow8-wJVEng_S56ZCAJbXQTZC',
  dedustDistributionWallet: 'EQB3fxHRLWvLTmFQdGKdD3pdmCTdjEo0o2UY8D7q0I8oyQss',
  distributionPool: 'EQDxHI2DNjj9zYfSc4LuENXq8qE7nlJLIxRcTmEjnaZmi7e1',
  strategy: 'EQDS_AtV5HqLOOOMU6bOR7_CP80tkzk_GJscGz4ECAB_-GLg',
  vault: 'EQAl2X9xhZzhRuIEEBK4CBQLp6pYuDUM-5FougbWHdRsK7RH',
  extraDistributionWallet: 'EQCrHRqbpWtBGrlf00CMx9AKGESphiWUbD_VSLozneBWAUCa',
  extraDistributionPool: 'EQCSyh3gs548BKzn62dIZMVTl6GkuqdSkaY_OeyUzpfqSaHZ'
}

export const addresses = {
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
  dedustNativeVault: 'EQDshQ2nyhezZleRdlZT12pvrj_cYp9XGmcRgYirA71DWugR',
  dedustDistributionFactory: 'EQC0WJSeustdSo4fI5eRXmxdu8rqyWz9tBwLmX9E94dQlUCv',
  extraRewardsDistributionFactory: 'EQDmtWKElPJLGJfjlN060ztD6-CwM_8HFNIFH507qiza-x6H',
  vaultFactory: 'EQAY7CBiTifcQeHStaCSbkG8qSeiG8FzEQW7ConWkE6FPHXc',
  vaults: [usdtVault, scaleVault, notVault]
} as const;