BEGIN;
SET LOCAL search_path TO restore_stage, public;
-- ===== /c/Users/seif_/AppData/Local/Temp/claude/S--DEV-proj-unilink-workspace/daea277d-7872-4e51-8d10-9dd75b4c7674/scratchpad/recovery/work/04a.sql
-- Slug and faculty-ID corrections to match the live catalogue (2026-10-13).

UPDATE "University" SET slug = 'universite-francaise-degypte' WHERE slug = 'universit-fran-aise-d-gypte';
UPDATE "Program" SET "facultyId" = 'fac_af45bcbf164a41859489' WHERE "facultyId" = 'fac_8609ce99a93346838b29';
UPDATE "MinimumScore" SET "facultyId" = 'fac_af45bcbf164a41859489' WHERE "facultyId" = 'fac_8609ce99a93346838b29';
UPDATE "Faculty" SET id = 'fac_af45bcbf164a41859489' WHERE id = 'fac_8609ce99a93346838b29';
UPDATE "Program" SET "facultyId" = 'fac_7a40b88772764afe926b' WHERE "facultyId" = 'fac_285f6ee8a47849c38bcf';
UPDATE "MinimumScore" SET "facultyId" = 'fac_7a40b88772764afe926b' WHERE "facultyId" = 'fac_285f6ee8a47849c38bcf';
UPDATE "Faculty" SET id = 'fac_7a40b88772764afe926b' WHERE id = 'fac_285f6ee8a47849c38bcf';
UPDATE "Program" SET "facultyId" = 'fac_64bb1008f69b421ea39c' WHERE "facultyId" = 'fac_d9d51ff47ea342a49272';
UPDATE "MinimumScore" SET "facultyId" = 'fac_64bb1008f69b421ea39c' WHERE "facultyId" = 'fac_d9d51ff47ea342a49272';
UPDATE "Faculty" SET id = 'fac_64bb1008f69b421ea39c' WHERE id = 'fac_d9d51ff47ea342a49272';
UPDATE "Program" SET "facultyId" = 'fac_ae2fe97e4592407e990d' WHERE "facultyId" = 'fac_e1b9d34ef32a4666a07a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ae2fe97e4592407e990d' WHERE "facultyId" = 'fac_e1b9d34ef32a4666a07a';
UPDATE "Faculty" SET id = 'fac_ae2fe97e4592407e990d' WHERE id = 'fac_e1b9d34ef32a4666a07a';
UPDATE "Program" SET "facultyId" = 'fac_b63ac2889bf54f96b935' WHERE "facultyId" = 'fac_35b7a9f20ffc45cfa66b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_b63ac2889bf54f96b935' WHERE "facultyId" = 'fac_35b7a9f20ffc45cfa66b';
UPDATE "Faculty" SET id = 'fac_b63ac2889bf54f96b935' WHERE id = 'fac_35b7a9f20ffc45cfa66b';
UPDATE "Program" SET "facultyId" = 'fac_e7e73968d70b404c9b04' WHERE "facultyId" = 'fac_c87deddbf614436792bb';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e7e73968d70b404c9b04' WHERE "facultyId" = 'fac_c87deddbf614436792bb';
UPDATE "Faculty" SET id = 'fac_e7e73968d70b404c9b04' WHERE id = 'fac_c87deddbf614436792bb';
UPDATE "Program" SET "facultyId" = 'fac_a77a992cc7c248c7b9d1' WHERE "facultyId" = 'fac_b8f28a0d570649ee9784';
UPDATE "MinimumScore" SET "facultyId" = 'fac_a77a992cc7c248c7b9d1' WHERE "facultyId" = 'fac_b8f28a0d570649ee9784';
UPDATE "Faculty" SET id = 'fac_a77a992cc7c248c7b9d1' WHERE id = 'fac_b8f28a0d570649ee9784';
UPDATE "Program" SET "facultyId" = 'fac_5195b072ed914cb2becf' WHERE "facultyId" = 'fac_0a5ac1c85b19452cb655';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5195b072ed914cb2becf' WHERE "facultyId" = 'fac_0a5ac1c85b19452cb655';
UPDATE "Faculty" SET id = 'fac_5195b072ed914cb2becf' WHERE id = 'fac_0a5ac1c85b19452cb655';
UPDATE "Program" SET "facultyId" = 'fac_8ca147ac19b442e9aba6' WHERE "facultyId" = 'fac_b3e0c981f09d4f149b4d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_8ca147ac19b442e9aba6' WHERE "facultyId" = 'fac_b3e0c981f09d4f149b4d';
UPDATE "Faculty" SET id = 'fac_8ca147ac19b442e9aba6' WHERE id = 'fac_b3e0c981f09d4f149b4d';
UPDATE "Program" SET "facultyId" = 'fac_c743960658234c09a803' WHERE "facultyId" = 'fac_fe0e054fd3734e75a9e7';
UPDATE "MinimumScore" SET "facultyId" = 'fac_c743960658234c09a803' WHERE "facultyId" = 'fac_fe0e054fd3734e75a9e7';
UPDATE "Faculty" SET id = 'fac_c743960658234c09a803' WHERE id = 'fac_fe0e054fd3734e75a9e7';
UPDATE "Program" SET "facultyId" = 'fac_d15ae06ab0c44b2a8fe3' WHERE "facultyId" = 'fac_2ee67ad6f8784882b8b0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d15ae06ab0c44b2a8fe3' WHERE "facultyId" = 'fac_2ee67ad6f8784882b8b0';
UPDATE "Faculty" SET id = 'fac_d15ae06ab0c44b2a8fe3' WHERE id = 'fac_2ee67ad6f8784882b8b0';
UPDATE "Program" SET "facultyId" = 'fac_cd781d2a8f2a44de9283' WHERE "facultyId" = 'fac_a05461d454a84a21ad55';
UPDATE "MinimumScore" SET "facultyId" = 'fac_cd781d2a8f2a44de9283' WHERE "facultyId" = 'fac_a05461d454a84a21ad55';
UPDATE "Faculty" SET id = 'fac_cd781d2a8f2a44de9283' WHERE id = 'fac_a05461d454a84a21ad55';
UPDATE "Program" SET "facultyId" = 'fac_e71e00b9003e4a5d9417' WHERE "facultyId" = 'fac_98888583a9554d578838';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e71e00b9003e4a5d9417' WHERE "facultyId" = 'fac_98888583a9554d578838';
UPDATE "Faculty" SET id = 'fac_e71e00b9003e4a5d9417' WHERE id = 'fac_98888583a9554d578838';
UPDATE "Program" SET "facultyId" = 'fac_7ae194f5892748a0b3dd' WHERE "facultyId" = 'fac_f3a43161f4844085881c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_7ae194f5892748a0b3dd' WHERE "facultyId" = 'fac_f3a43161f4844085881c';
UPDATE "Faculty" SET id = 'fac_7ae194f5892748a0b3dd' WHERE id = 'fac_f3a43161f4844085881c';
UPDATE "Program" SET "facultyId" = 'fac_bd5fbc1c64b94724bb0b' WHERE "facultyId" = 'fac_5c5e800c20424339b51f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_bd5fbc1c64b94724bb0b' WHERE "facultyId" = 'fac_5c5e800c20424339b51f';
UPDATE "Faculty" SET id = 'fac_bd5fbc1c64b94724bb0b' WHERE id = 'fac_5c5e800c20424339b51f';
UPDATE "Program" SET "facultyId" = 'fac_532b1cd6d8da4a2d89ef' WHERE "facultyId" = 'fac_40049c40aca045ab852a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_532b1cd6d8da4a2d89ef' WHERE "facultyId" = 'fac_40049c40aca045ab852a';
UPDATE "Faculty" SET id = 'fac_532b1cd6d8da4a2d89ef' WHERE id = 'fac_40049c40aca045ab852a';
UPDATE "Program" SET "facultyId" = 'fac_d1396c19fd0f416ca3e6' WHERE "facultyId" = 'fac_ee0306050e5f46bfb0b7';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d1396c19fd0f416ca3e6' WHERE "facultyId" = 'fac_ee0306050e5f46bfb0b7';
UPDATE "Faculty" SET id = 'fac_d1396c19fd0f416ca3e6' WHERE id = 'fac_ee0306050e5f46bfb0b7';
UPDATE "Program" SET "facultyId" = 'fac_2bbf2df9723c48028b50' WHERE "facultyId" = 'fac_50cc15cf6ea143f294c7';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2bbf2df9723c48028b50' WHERE "facultyId" = 'fac_50cc15cf6ea143f294c7';
UPDATE "Faculty" SET id = 'fac_2bbf2df9723c48028b50' WHERE id = 'fac_50cc15cf6ea143f294c7';
UPDATE "Program" SET "facultyId" = 'fac_e640744ae8934ff8822b' WHERE "facultyId" = 'fac_f32d50b15d5c46fc9a81';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e640744ae8934ff8822b' WHERE "facultyId" = 'fac_f32d50b15d5c46fc9a81';
UPDATE "Faculty" SET id = 'fac_e640744ae8934ff8822b' WHERE id = 'fac_f32d50b15d5c46fc9a81';
UPDATE "Program" SET "facultyId" = 'fac_c37c6fb02b4443048790' WHERE "facultyId" = 'fac_81b42daf94c44661afc6';
UPDATE "MinimumScore" SET "facultyId" = 'fac_c37c6fb02b4443048790' WHERE "facultyId" = 'fac_81b42daf94c44661afc6';
UPDATE "Faculty" SET id = 'fac_c37c6fb02b4443048790' WHERE id = 'fac_81b42daf94c44661afc6';
UPDATE "Program" SET "facultyId" = 'fac_cb6ffab2d8dd42b4835a' WHERE "facultyId" = 'fac_5e584b3689ef4039ad36';
UPDATE "MinimumScore" SET "facultyId" = 'fac_cb6ffab2d8dd42b4835a' WHERE "facultyId" = 'fac_5e584b3689ef4039ad36';
UPDATE "Faculty" SET id = 'fac_cb6ffab2d8dd42b4835a' WHERE id = 'fac_5e584b3689ef4039ad36';
UPDATE "Program" SET "facultyId" = 'fac_a5e55ebc0e5f4855a10e' WHERE "facultyId" = 'fac_a7378672e1e14059b70e';
UPDATE "MinimumScore" SET "facultyId" = 'fac_a5e55ebc0e5f4855a10e' WHERE "facultyId" = 'fac_a7378672e1e14059b70e';
UPDATE "Faculty" SET id = 'fac_a5e55ebc0e5f4855a10e' WHERE id = 'fac_a7378672e1e14059b70e';
UPDATE "Program" SET "facultyId" = 'fac_f6b96d207bba4a349a26' WHERE "facultyId" = 'fac_4f03c3bf1e794ede9e2e';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f6b96d207bba4a349a26' WHERE "facultyId" = 'fac_4f03c3bf1e794ede9e2e';
UPDATE "Faculty" SET id = 'fac_f6b96d207bba4a349a26' WHERE id = 'fac_4f03c3bf1e794ede9e2e';
UPDATE "Program" SET "facultyId" = 'fac_9b88389058b94bbbb144' WHERE "facultyId" = 'fac_2b51a9a700a64b13aa8d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9b88389058b94bbbb144' WHERE "facultyId" = 'fac_2b51a9a700a64b13aa8d';
UPDATE "Faculty" SET id = 'fac_9b88389058b94bbbb144' WHERE id = 'fac_2b51a9a700a64b13aa8d';
UPDATE "Program" SET "facultyId" = 'fac_de46f2c2e5ea42bf9225' WHERE "facultyId" = 'fac_ff08083e866648a2b784';
UPDATE "MinimumScore" SET "facultyId" = 'fac_de46f2c2e5ea42bf9225' WHERE "facultyId" = 'fac_ff08083e866648a2b784';
UPDATE "Faculty" SET id = 'fac_de46f2c2e5ea42bf9225' WHERE id = 'fac_ff08083e866648a2b784';
UPDATE "Program" SET "facultyId" = 'fac_4ffae997b78f4614bb97' WHERE "facultyId" = 'fac_9f23726ae82344d2a7c3';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4ffae997b78f4614bb97' WHERE "facultyId" = 'fac_9f23726ae82344d2a7c3';
UPDATE "Faculty" SET id = 'fac_4ffae997b78f4614bb97' WHERE id = 'fac_9f23726ae82344d2a7c3';
UPDATE "Program" SET "facultyId" = 'fac_9f5787b5a3da4e34a833' WHERE "facultyId" = 'fac_d5508f4db3734c89a510';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9f5787b5a3da4e34a833' WHERE "facultyId" = 'fac_d5508f4db3734c89a510';
UPDATE "Faculty" SET id = 'fac_9f5787b5a3da4e34a833' WHERE id = 'fac_d5508f4db3734c89a510';
UPDATE "Program" SET "facultyId" = 'fac_fa55f74193564dc99470' WHERE "facultyId" = 'fac_79e417f4146444348346';
UPDATE "MinimumScore" SET "facultyId" = 'fac_fa55f74193564dc99470' WHERE "facultyId" = 'fac_79e417f4146444348346';
UPDATE "Faculty" SET id = 'fac_fa55f74193564dc99470' WHERE id = 'fac_79e417f4146444348346';
UPDATE "Program" SET "facultyId" = 'fac_242b2db56be04ea0b4c4' WHERE "facultyId" = 'fac_bfb7556c21584852a138';
UPDATE "MinimumScore" SET "facultyId" = 'fac_242b2db56be04ea0b4c4' WHERE "facultyId" = 'fac_bfb7556c21584852a138';
UPDATE "Faculty" SET id = 'fac_242b2db56be04ea0b4c4' WHERE id = 'fac_bfb7556c21584852a138';
UPDATE "Program" SET "facultyId" = 'fac_e1eed2c8875548d6b579' WHERE "facultyId" = 'fac_2ae52412f6b549f6afb1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e1eed2c8875548d6b579' WHERE "facultyId" = 'fac_2ae52412f6b549f6afb1';
UPDATE "Faculty" SET id = 'fac_e1eed2c8875548d6b579' WHERE id = 'fac_2ae52412f6b549f6afb1';
UPDATE "Program" SET "facultyId" = 'fac_4dedb1f5e46047cba54a' WHERE "facultyId" = 'fac_04dbea5948ca4d9b98aa';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4dedb1f5e46047cba54a' WHERE "facultyId" = 'fac_04dbea5948ca4d9b98aa';
UPDATE "Faculty" SET id = 'fac_4dedb1f5e46047cba54a' WHERE id = 'fac_04dbea5948ca4d9b98aa';
UPDATE "Program" SET "facultyId" = 'fac_9c16642eb1404e70801d' WHERE "facultyId" = 'fac_d4d77dadf7be469387f0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9c16642eb1404e70801d' WHERE "facultyId" = 'fac_d4d77dadf7be469387f0';
UPDATE "Faculty" SET id = 'fac_9c16642eb1404e70801d' WHERE id = 'fac_d4d77dadf7be469387f0';
UPDATE "Program" SET "facultyId" = 'fac_bde544d141fe46448926' WHERE "facultyId" = 'fac_23cfab70ca164b03850a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_bde544d141fe46448926' WHERE "facultyId" = 'fac_23cfab70ca164b03850a';
UPDATE "Faculty" SET id = 'fac_bde544d141fe46448926' WHERE id = 'fac_23cfab70ca164b03850a';
UPDATE "Program" SET "facultyId" = 'fac_dccc1e10e5404ab4848e' WHERE "facultyId" = 'fac_16caec03978f4067ba22';
UPDATE "MinimumScore" SET "facultyId" = 'fac_dccc1e10e5404ab4848e' WHERE "facultyId" = 'fac_16caec03978f4067ba22';
UPDATE "Faculty" SET id = 'fac_dccc1e10e5404ab4848e' WHERE id = 'fac_16caec03978f4067ba22';
UPDATE "Program" SET "facultyId" = 'fac_52c3a30ee6af45db9397' WHERE "facultyId" = 'fac_858bb6cdbe13478996e8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_52c3a30ee6af45db9397' WHERE "facultyId" = 'fac_858bb6cdbe13478996e8';
UPDATE "Faculty" SET id = 'fac_52c3a30ee6af45db9397' WHERE id = 'fac_858bb6cdbe13478996e8';
UPDATE "Program" SET "facultyId" = 'fac_7a9032494fd94dc39fb4' WHERE "facultyId" = 'fac_23b4c1d8a3834de9b8d3';
UPDATE "MinimumScore" SET "facultyId" = 'fac_7a9032494fd94dc39fb4' WHERE "facultyId" = 'fac_23b4c1d8a3834de9b8d3';
UPDATE "Faculty" SET id = 'fac_7a9032494fd94dc39fb4' WHERE id = 'fac_23b4c1d8a3834de9b8d3';
UPDATE "Program" SET "facultyId" = 'fac_9759c007a2574550bd3a' WHERE "facultyId" = 'fac_6dd32c1f473545fda19d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9759c007a2574550bd3a' WHERE "facultyId" = 'fac_6dd32c1f473545fda19d';
UPDATE "Faculty" SET id = 'fac_9759c007a2574550bd3a' WHERE id = 'fac_6dd32c1f473545fda19d';
UPDATE "Program" SET "facultyId" = 'fac_6df1157bdc07472bbcb2' WHERE "facultyId" = 'fac_054d4048f4d84f7aa944';
UPDATE "MinimumScore" SET "facultyId" = 'fac_6df1157bdc07472bbcb2' WHERE "facultyId" = 'fac_054d4048f4d84f7aa944';
UPDATE "Faculty" SET id = 'fac_6df1157bdc07472bbcb2' WHERE id = 'fac_054d4048f4d84f7aa944';
UPDATE "Program" SET "facultyId" = 'fac_890c013ec0274e98b950' WHERE "facultyId" = 'fac_9b1f8fb8114c41a2aa50';
UPDATE "MinimumScore" SET "facultyId" = 'fac_890c013ec0274e98b950' WHERE "facultyId" = 'fac_9b1f8fb8114c41a2aa50';
UPDATE "Faculty" SET id = 'fac_890c013ec0274e98b950' WHERE id = 'fac_9b1f8fb8114c41a2aa50';
UPDATE "Program" SET "facultyId" = 'fac_05d9beb9063c4aedb7ee' WHERE "facultyId" = 'fac_ecfdd33be20a4e5ba3b9';
UPDATE "MinimumScore" SET "facultyId" = 'fac_05d9beb9063c4aedb7ee' WHERE "facultyId" = 'fac_ecfdd33be20a4e5ba3b9';
UPDATE "Faculty" SET id = 'fac_05d9beb9063c4aedb7ee' WHERE id = 'fac_ecfdd33be20a4e5ba3b9';
UPDATE "Program" SET "facultyId" = 'fac_d188090a5f044ad89746' WHERE "facultyId" = 'fac_8857dc096a8f434e8674';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d188090a5f044ad89746' WHERE "facultyId" = 'fac_8857dc096a8f434e8674';
UPDATE "Faculty" SET id = 'fac_d188090a5f044ad89746' WHERE id = 'fac_8857dc096a8f434e8674';
UPDATE "Program" SET "facultyId" = 'fac_eacc2f8d2e374db082be' WHERE "facultyId" = 'fac_5dcc2968f2fc46b1bf01';
UPDATE "MinimumScore" SET "facultyId" = 'fac_eacc2f8d2e374db082be' WHERE "facultyId" = 'fac_5dcc2968f2fc46b1bf01';
UPDATE "Faculty" SET id = 'fac_eacc2f8d2e374db082be' WHERE id = 'fac_5dcc2968f2fc46b1bf01';
UPDATE "Program" SET "facultyId" = 'fac_12f7dd232f0b47fba77d' WHERE "facultyId" = 'fac_8ea6c7736ea34dd29c80';
UPDATE "MinimumScore" SET "facultyId" = 'fac_12f7dd232f0b47fba77d' WHERE "facultyId" = 'fac_8ea6c7736ea34dd29c80';
UPDATE "Faculty" SET id = 'fac_12f7dd232f0b47fba77d' WHERE id = 'fac_8ea6c7736ea34dd29c80';
UPDATE "Program" SET "facultyId" = 'fac_ea85092146c247d88db0' WHERE "facultyId" = 'fac_677a4575d41e4f7fb1ed';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ea85092146c247d88db0' WHERE "facultyId" = 'fac_677a4575d41e4f7fb1ed';
UPDATE "Faculty" SET id = 'fac_ea85092146c247d88db0' WHERE id = 'fac_677a4575d41e4f7fb1ed';
UPDATE "Program" SET "facultyId" = 'fac_142b81ff3f9840dd8e6c' WHERE "facultyId" = 'fac_aa913abff5bc41a89cd0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_142b81ff3f9840dd8e6c' WHERE "facultyId" = 'fac_aa913abff5bc41a89cd0';
UPDATE "Faculty" SET id = 'fac_142b81ff3f9840dd8e6c' WHERE id = 'fac_aa913abff5bc41a89cd0';
UPDATE "Program" SET "facultyId" = 'fac_e00ef253c0c84ab8a17a' WHERE "facultyId" = 'fac_233b9f3061804e22b0fb';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e00ef253c0c84ab8a17a' WHERE "facultyId" = 'fac_233b9f3061804e22b0fb';
UPDATE "Faculty" SET id = 'fac_e00ef253c0c84ab8a17a' WHERE id = 'fac_233b9f3061804e22b0fb';
UPDATE "Program" SET "facultyId" = 'fac_542299f142274866981f' WHERE "facultyId" = 'fac_b15377ee2b964586a38b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_542299f142274866981f' WHERE "facultyId" = 'fac_b15377ee2b964586a38b';
UPDATE "Faculty" SET id = 'fac_542299f142274866981f' WHERE id = 'fac_b15377ee2b964586a38b';
UPDATE "Program" SET "facultyId" = 'fac_70f80f1a74cb453d8224' WHERE "facultyId" = 'fac_14c14629ceef4db2b291';
UPDATE "MinimumScore" SET "facultyId" = 'fac_70f80f1a74cb453d8224' WHERE "facultyId" = 'fac_14c14629ceef4db2b291';
UPDATE "Faculty" SET id = 'fac_70f80f1a74cb453d8224' WHERE id = 'fac_14c14629ceef4db2b291';
UPDATE "Program" SET "facultyId" = 'fac_373f072a77b7458b9a1b' WHERE "facultyId" = 'fac_b1c542db32e0490ca25d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_373f072a77b7458b9a1b' WHERE "facultyId" = 'fac_b1c542db32e0490ca25d';
UPDATE "Faculty" SET id = 'fac_373f072a77b7458b9a1b' WHERE id = 'fac_b1c542db32e0490ca25d';
UPDATE "Program" SET "facultyId" = 'fac_545fbb763f314cc9abeb' WHERE "facultyId" = 'fac_a26fbae5833647d2ab4a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_545fbb763f314cc9abeb' WHERE "facultyId" = 'fac_a26fbae5833647d2ab4a';
UPDATE "Faculty" SET id = 'fac_545fbb763f314cc9abeb' WHERE id = 'fac_a26fbae5833647d2ab4a';
UPDATE "Program" SET "facultyId" = 'fac_24a8e57b2a9d47f79f47' WHERE "facultyId" = 'fac_7a6faedeca19420a8a17';
UPDATE "MinimumScore" SET "facultyId" = 'fac_24a8e57b2a9d47f79f47' WHERE "facultyId" = 'fac_7a6faedeca19420a8a17';
UPDATE "Faculty" SET id = 'fac_24a8e57b2a9d47f79f47' WHERE id = 'fac_7a6faedeca19420a8a17';
UPDATE "Program" SET "facultyId" = 'fac_2ce54d25cd1c4e86a30a' WHERE "facultyId" = 'fac_bff955dab55a48edbcf3';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2ce54d25cd1c4e86a30a' WHERE "facultyId" = 'fac_bff955dab55a48edbcf3';
UPDATE "Faculty" SET id = 'fac_2ce54d25cd1c4e86a30a' WHERE id = 'fac_bff955dab55a48edbcf3';
UPDATE "Program" SET "facultyId" = 'fac_a90d6e2bf98c4ca09a9d' WHERE "facultyId" = 'fac_b570343078b74764b16c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_a90d6e2bf98c4ca09a9d' WHERE "facultyId" = 'fac_b570343078b74764b16c';
UPDATE "Faculty" SET id = 'fac_a90d6e2bf98c4ca09a9d' WHERE id = 'fac_b570343078b74764b16c';
UPDATE "Program" SET "facultyId" = 'fac_d15e870cc23f47c3a6f9' WHERE "facultyId" = 'fac_b58f3e1daf9045aaa4c4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d15e870cc23f47c3a6f9' WHERE "facultyId" = 'fac_b58f3e1daf9045aaa4c4';
UPDATE "Faculty" SET id = 'fac_d15e870cc23f47c3a6f9' WHERE id = 'fac_b58f3e1daf9045aaa4c4';
UPDATE "Program" SET "facultyId" = 'fac_ae820aedda2a4713a49f' WHERE "facultyId" = 'fac_d957728aaa844e1ab73c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ae820aedda2a4713a49f' WHERE "facultyId" = 'fac_d957728aaa844e1ab73c';
UPDATE "Faculty" SET id = 'fac_ae820aedda2a4713a49f' WHERE id = 'fac_d957728aaa844e1ab73c';
UPDATE "Program" SET "facultyId" = 'fac_f28c8c7d71e649b5ac98' WHERE "facultyId" = 'fac_472c1ac4cbef4aa2991f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f28c8c7d71e649b5ac98' WHERE "facultyId" = 'fac_472c1ac4cbef4aa2991f';
UPDATE "Faculty" SET id = 'fac_f28c8c7d71e649b5ac98' WHERE id = 'fac_472c1ac4cbef4aa2991f';
UPDATE "Program" SET "facultyId" = 'fac_3f53b6eab05e42938e52' WHERE "facultyId" = 'fac_1a565f62b94d4e5a8287';
UPDATE "MinimumScore" SET "facultyId" = 'fac_3f53b6eab05e42938e52' WHERE "facultyId" = 'fac_1a565f62b94d4e5a8287';
UPDATE "Faculty" SET id = 'fac_3f53b6eab05e42938e52' WHERE id = 'fac_1a565f62b94d4e5a8287';
UPDATE "Program" SET "facultyId" = 'fac_8c99ca4be4b2451f8c7b' WHERE "facultyId" = 'fac_1eab607e264b4fb2a4c0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_8c99ca4be4b2451f8c7b' WHERE "facultyId" = 'fac_1eab607e264b4fb2a4c0';
UPDATE "Faculty" SET id = 'fac_8c99ca4be4b2451f8c7b' WHERE id = 'fac_1eab607e264b4fb2a4c0';
UPDATE "Program" SET "facultyId" = 'fac_3c1e4688d3ae4db682fa' WHERE "facultyId" = 'fac_11a3534c503942c180a6';
UPDATE "MinimumScore" SET "facultyId" = 'fac_3c1e4688d3ae4db682fa' WHERE "facultyId" = 'fac_11a3534c503942c180a6';
UPDATE "Faculty" SET id = 'fac_3c1e4688d3ae4db682fa' WHERE id = 'fac_11a3534c503942c180a6';
UPDATE "Program" SET "facultyId" = 'fac_0f03949184a54a2c9a6a' WHERE "facultyId" = 'fac_63a77d92a80144beaa7c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0f03949184a54a2c9a6a' WHERE "facultyId" = 'fac_63a77d92a80144beaa7c';
UPDATE "Faculty" SET id = 'fac_0f03949184a54a2c9a6a' WHERE id = 'fac_63a77d92a80144beaa7c';
UPDATE "Program" SET "facultyId" = 'fac_845a82a6dc8045f9a323' WHERE "facultyId" = 'fac_a85370f0d73247f8ba28';
UPDATE "MinimumScore" SET "facultyId" = 'fac_845a82a6dc8045f9a323' WHERE "facultyId" = 'fac_a85370f0d73247f8ba28';
UPDATE "Faculty" SET id = 'fac_845a82a6dc8045f9a323' WHERE id = 'fac_a85370f0d73247f8ba28';
UPDATE "Program" SET "facultyId" = 'fac_2d9cab74215e421098c0' WHERE "facultyId" = 'fac_945dd9e575da4fafb772';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2d9cab74215e421098c0' WHERE "facultyId" = 'fac_945dd9e575da4fafb772';
UPDATE "Faculty" SET id = 'fac_2d9cab74215e421098c0' WHERE id = 'fac_945dd9e575da4fafb772';
UPDATE "Program" SET "facultyId" = 'fac_779aadf965184b5d95e7' WHERE "facultyId" = 'fac_93e0bfeb807e4d29adb5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_779aadf965184b5d95e7' WHERE "facultyId" = 'fac_93e0bfeb807e4d29adb5';
UPDATE "Faculty" SET id = 'fac_779aadf965184b5d95e7' WHERE id = 'fac_93e0bfeb807e4d29adb5';
UPDATE "Program" SET "facultyId" = 'fac_d26d95a797194988bb85' WHERE "facultyId" = 'fac_ca25431ba2414ad0a7c4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d26d95a797194988bb85' WHERE "facultyId" = 'fac_ca25431ba2414ad0a7c4';
UPDATE "Faculty" SET id = 'fac_d26d95a797194988bb85' WHERE id = 'fac_ca25431ba2414ad0a7c4';
UPDATE "Program" SET "facultyId" = 'fac_eb0f64b1e9014b1fb3ca' WHERE "facultyId" = 'fac_f3e696d904344f69941f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_eb0f64b1e9014b1fb3ca' WHERE "facultyId" = 'fac_f3e696d904344f69941f';
UPDATE "Faculty" SET id = 'fac_eb0f64b1e9014b1fb3ca' WHERE id = 'fac_f3e696d904344f69941f';
UPDATE "Program" SET "facultyId" = 'fac_5640d3d93c1e49eeb681' WHERE "facultyId" = 'fac_e986d81d486141929c83';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5640d3d93c1e49eeb681' WHERE "facultyId" = 'fac_e986d81d486141929c83';
UPDATE "Faculty" SET id = 'fac_5640d3d93c1e49eeb681' WHERE id = 'fac_e986d81d486141929c83';
UPDATE "Program" SET "facultyId" = 'fac_64c1527dc78a48018fe4' WHERE "facultyId" = 'fac_d3028b0fe225448fb856';
UPDATE "MinimumScore" SET "facultyId" = 'fac_64c1527dc78a48018fe4' WHERE "facultyId" = 'fac_d3028b0fe225448fb856';
UPDATE "Faculty" SET id = 'fac_64c1527dc78a48018fe4' WHERE id = 'fac_d3028b0fe225448fb856';
UPDATE "Program" SET "facultyId" = 'fac_920eacf7df1d4f4f9642' WHERE "facultyId" = 'fac_32609d138a4c4bac853d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_920eacf7df1d4f4f9642' WHERE "facultyId" = 'fac_32609d138a4c4bac853d';
UPDATE "Faculty" SET id = 'fac_920eacf7df1d4f4f9642' WHERE id = 'fac_32609d138a4c4bac853d';
UPDATE "Program" SET "facultyId" = 'fac_ff4da051a55b493b99ba' WHERE "facultyId" = 'fac_35aaed31e2944b8a919c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ff4da051a55b493b99ba' WHERE "facultyId" = 'fac_35aaed31e2944b8a919c';
UPDATE "Faculty" SET id = 'fac_ff4da051a55b493b99ba' WHERE id = 'fac_35aaed31e2944b8a919c';
UPDATE "Program" SET "facultyId" = 'fac_30302d45571b40f99b80' WHERE "facultyId" = 'fac_8dd1d69e90d0405d8449';
UPDATE "MinimumScore" SET "facultyId" = 'fac_30302d45571b40f99b80' WHERE "facultyId" = 'fac_8dd1d69e90d0405d8449';
UPDATE "Faculty" SET id = 'fac_30302d45571b40f99b80' WHERE id = 'fac_8dd1d69e90d0405d8449';
UPDATE "Program" SET "facultyId" = 'fac_e79d7b65f88a48aeb335' WHERE "facultyId" = 'fac_5b8e9c8d85534f95adc1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e79d7b65f88a48aeb335' WHERE "facultyId" = 'fac_5b8e9c8d85534f95adc1';
UPDATE "Faculty" SET id = 'fac_e79d7b65f88a48aeb335' WHERE id = 'fac_5b8e9c8d85534f95adc1';
UPDATE "Program" SET "facultyId" = 'fac_81c03f9b4fa245a9ba6f' WHERE "facultyId" = 'fac_69cd51f44a3743a09a49';
UPDATE "MinimumScore" SET "facultyId" = 'fac_81c03f9b4fa245a9ba6f' WHERE "facultyId" = 'fac_69cd51f44a3743a09a49';
UPDATE "Faculty" SET id = 'fac_81c03f9b4fa245a9ba6f' WHERE id = 'fac_69cd51f44a3743a09a49';
UPDATE "Program" SET "facultyId" = 'fac_fa89c84c4cda41ab8fda' WHERE "facultyId" = 'fac_93fad420f4484bf3ad48';
UPDATE "MinimumScore" SET "facultyId" = 'fac_fa89c84c4cda41ab8fda' WHERE "facultyId" = 'fac_93fad420f4484bf3ad48';
UPDATE "Faculty" SET id = 'fac_fa89c84c4cda41ab8fda' WHERE id = 'fac_93fad420f4484bf3ad48';
UPDATE "Program" SET "facultyId" = 'fac_065afa72ecd34efeb93d' WHERE "facultyId" = 'fac_fe003c7043e94371aeb5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_065afa72ecd34efeb93d' WHERE "facultyId" = 'fac_fe003c7043e94371aeb5';
UPDATE "Faculty" SET id = 'fac_065afa72ecd34efeb93d' WHERE id = 'fac_fe003c7043e94371aeb5';
UPDATE "Program" SET "facultyId" = 'fac_2c964201300b4a869d34' WHERE "facultyId" = 'fac_405e5625884f40249d52';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2c964201300b4a869d34' WHERE "facultyId" = 'fac_405e5625884f40249d52';
UPDATE "Faculty" SET id = 'fac_2c964201300b4a869d34' WHERE id = 'fac_405e5625884f40249d52';
UPDATE "Program" SET "facultyId" = 'fac_b9e376fc3be44042b549' WHERE "facultyId" = 'fac_5e5efaee927e43a8b02d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_b9e376fc3be44042b549' WHERE "facultyId" = 'fac_5e5efaee927e43a8b02d';
UPDATE "Faculty" SET id = 'fac_b9e376fc3be44042b549' WHERE id = 'fac_5e5efaee927e43a8b02d';
UPDATE "Program" SET "facultyId" = 'fac_5c135defe6794a95bf6c' WHERE "facultyId" = 'fac_156d2291f8584e459104';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5c135defe6794a95bf6c' WHERE "facultyId" = 'fac_156d2291f8584e459104';
UPDATE "Faculty" SET id = 'fac_5c135defe6794a95bf6c' WHERE id = 'fac_156d2291f8584e459104';
UPDATE "Program" SET "facultyId" = 'fac_e798ff90ae2742a3a504' WHERE "facultyId" = 'fac_eda54dea15094f54a4d1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e798ff90ae2742a3a504' WHERE "facultyId" = 'fac_eda54dea15094f54a4d1';
UPDATE "Faculty" SET id = 'fac_e798ff90ae2742a3a504' WHERE id = 'fac_eda54dea15094f54a4d1';
UPDATE "Program" SET "facultyId" = 'fac_e9e3d55f2520434797a8' WHERE "facultyId" = 'fac_4760d9dc66bf43748190';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e9e3d55f2520434797a8' WHERE "facultyId" = 'fac_4760d9dc66bf43748190';
UPDATE "Faculty" SET id = 'fac_e9e3d55f2520434797a8' WHERE id = 'fac_4760d9dc66bf43748190';
UPDATE "Program" SET "facultyId" = 'fac_a0150ab52ce94c12bdf4' WHERE "facultyId" = 'fac_93fe963651ae4037945b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_a0150ab52ce94c12bdf4' WHERE "facultyId" = 'fac_93fe963651ae4037945b';
UPDATE "Faculty" SET id = 'fac_a0150ab52ce94c12bdf4' WHERE id = 'fac_93fe963651ae4037945b';
UPDATE "Program" SET "facultyId" = 'fac_45b478b280544fdbb2ae' WHERE "facultyId" = 'fac_e6b29c25a3d44261bd5b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_45b478b280544fdbb2ae' WHERE "facultyId" = 'fac_e6b29c25a3d44261bd5b';
UPDATE "Faculty" SET id = 'fac_45b478b280544fdbb2ae' WHERE id = 'fac_e6b29c25a3d44261bd5b';
UPDATE "Program" SET "facultyId" = 'fac_d92d05c86f8d4757890d' WHERE "facultyId" = 'fac_f1f1f9836e764ff38362';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d92d05c86f8d4757890d' WHERE "facultyId" = 'fac_f1f1f9836e764ff38362';
UPDATE "Faculty" SET id = 'fac_d92d05c86f8d4757890d' WHERE id = 'fac_f1f1f9836e764ff38362';
UPDATE "Program" SET "facultyId" = 'fac_4e326a48b05242088772' WHERE "facultyId" = 'fac_b45306d737e1461faee1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4e326a48b05242088772' WHERE "facultyId" = 'fac_b45306d737e1461faee1';
UPDATE "Faculty" SET id = 'fac_4e326a48b05242088772' WHERE id = 'fac_b45306d737e1461faee1';
UPDATE "Program" SET "facultyId" = 'fac_5867289c26b344d3808d' WHERE "facultyId" = 'fac_94c5884c768c49feb442';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5867289c26b344d3808d' WHERE "facultyId" = 'fac_94c5884c768c49feb442';
UPDATE "Faculty" SET id = 'fac_5867289c26b344d3808d' WHERE id = 'fac_94c5884c768c49feb442';
UPDATE "Program" SET "facultyId" = 'fac_3222e421f48f475f9f69' WHERE "facultyId" = 'fac_364ac2b773694e6eaed8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_3222e421f48f475f9f69' WHERE "facultyId" = 'fac_364ac2b773694e6eaed8';
UPDATE "Faculty" SET id = 'fac_3222e421f48f475f9f69' WHERE id = 'fac_364ac2b773694e6eaed8';
UPDATE "Program" SET "facultyId" = 'fac_5d8d8a01783c4719bc4b' WHERE "facultyId" = 'fac_a39ccb3a5f8f4dae8488';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5d8d8a01783c4719bc4b' WHERE "facultyId" = 'fac_a39ccb3a5f8f4dae8488';
UPDATE "Faculty" SET id = 'fac_5d8d8a01783c4719bc4b' WHERE id = 'fac_a39ccb3a5f8f4dae8488';
UPDATE "Program" SET "facultyId" = 'fac_394b01876f6f464f8fee' WHERE "facultyId" = 'fac_ab917f1acd4248e39449';
UPDATE "MinimumScore" SET "facultyId" = 'fac_394b01876f6f464f8fee' WHERE "facultyId" = 'fac_ab917f1acd4248e39449';
UPDATE "Faculty" SET id = 'fac_394b01876f6f464f8fee' WHERE id = 'fac_ab917f1acd4248e39449';
UPDATE "Program" SET "facultyId" = 'fac_1e674d68403846e18cf9' WHERE "facultyId" = 'fac_08d5f99d3e774d4f84ff';
UPDATE "MinimumScore" SET "facultyId" = 'fac_1e674d68403846e18cf9' WHERE "facultyId" = 'fac_08d5f99d3e774d4f84ff';
UPDATE "Faculty" SET id = 'fac_1e674d68403846e18cf9' WHERE id = 'fac_08d5f99d3e774d4f84ff';
UPDATE "Program" SET "facultyId" = 'fac_2c32c244374746908dd6' WHERE "facultyId" = 'fac_695c46dcabb748f284ca';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2c32c244374746908dd6' WHERE "facultyId" = 'fac_695c46dcabb748f284ca';
UPDATE "Faculty" SET id = 'fac_2c32c244374746908dd6' WHERE id = 'fac_695c46dcabb748f284ca';
UPDATE "Program" SET "facultyId" = 'fac_25a25ca38db745e2a351' WHERE "facultyId" = 'fac_db354b8ea9124b30bf06';
UPDATE "MinimumScore" SET "facultyId" = 'fac_25a25ca38db745e2a351' WHERE "facultyId" = 'fac_db354b8ea9124b30bf06';
UPDATE "Faculty" SET id = 'fac_25a25ca38db745e2a351' WHERE id = 'fac_db354b8ea9124b30bf06';
UPDATE "Program" SET "facultyId" = 'fac_77c7b3e956e5443b812f' WHERE "facultyId" = 'fac_0f4e1455db3c49ad845f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_77c7b3e956e5443b812f' WHERE "facultyId" = 'fac_0f4e1455db3c49ad845f';
UPDATE "Faculty" SET id = 'fac_77c7b3e956e5443b812f' WHERE id = 'fac_0f4e1455db3c49ad845f';
UPDATE "Program" SET "facultyId" = 'fac_eb632295e246469fada7' WHERE "facultyId" = 'fac_3408f9b54c3d4e10a61b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_eb632295e246469fada7' WHERE "facultyId" = 'fac_3408f9b54c3d4e10a61b';
UPDATE "Faculty" SET id = 'fac_eb632295e246469fada7' WHERE id = 'fac_3408f9b54c3d4e10a61b';
UPDATE "Program" SET "facultyId" = 'fac_d52818c180a1429185f9' WHERE "facultyId" = 'fac_a4fdf9aebddd4586a1b9';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d52818c180a1429185f9' WHERE "facultyId" = 'fac_a4fdf9aebddd4586a1b9';
UPDATE "Faculty" SET id = 'fac_d52818c180a1429185f9' WHERE id = 'fac_a4fdf9aebddd4586a1b9';
UPDATE "Program" SET "facultyId" = 'fac_150ef988af554cb7b5c5' WHERE "facultyId" = 'fac_c8aeea9053fd45f1b9f5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_150ef988af554cb7b5c5' WHERE "facultyId" = 'fac_c8aeea9053fd45f1b9f5';
UPDATE "Faculty" SET id = 'fac_150ef988af554cb7b5c5' WHERE id = 'fac_c8aeea9053fd45f1b9f5';
UPDATE "Program" SET "facultyId" = 'fac_79638da8ac47456a8cb5' WHERE "facultyId" = 'fac_2cb93e1a60e94417be05';
UPDATE "MinimumScore" SET "facultyId" = 'fac_79638da8ac47456a8cb5' WHERE "facultyId" = 'fac_2cb93e1a60e94417be05';
UPDATE "Faculty" SET id = 'fac_79638da8ac47456a8cb5' WHERE id = 'fac_2cb93e1a60e94417be05';
UPDATE "Program" SET "facultyId" = 'fac_8ab2a04a84604626b8f2' WHERE "facultyId" = 'fac_b55c499b9dd84ee5b799';
UPDATE "MinimumScore" SET "facultyId" = 'fac_8ab2a04a84604626b8f2' WHERE "facultyId" = 'fac_b55c499b9dd84ee5b799';
UPDATE "Faculty" SET id = 'fac_8ab2a04a84604626b8f2' WHERE id = 'fac_b55c499b9dd84ee5b799';
UPDATE "Program" SET "facultyId" = 'fac_a97ad2a7ee1142bfb5e1' WHERE "facultyId" = 'fac_fcc01051a78944fda763';
UPDATE "MinimumScore" SET "facultyId" = 'fac_a97ad2a7ee1142bfb5e1' WHERE "facultyId" = 'fac_fcc01051a78944fda763';
UPDATE "Faculty" SET id = 'fac_a97ad2a7ee1142bfb5e1' WHERE id = 'fac_fcc01051a78944fda763';
UPDATE "Program" SET "facultyId" = 'fac_752f3136ca624573bd38' WHERE "facultyId" = 'fac_5a04f7f635454c5d82a4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_752f3136ca624573bd38' WHERE "facultyId" = 'fac_5a04f7f635454c5d82a4';
UPDATE "Faculty" SET id = 'fac_752f3136ca624573bd38' WHERE id = 'fac_5a04f7f635454c5d82a4';
UPDATE "Program" SET "facultyId" = 'fac_f3b38ac22be140cdb9fb' WHERE "facultyId" = 'fac_13a1041ab1e64b2a888f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f3b38ac22be140cdb9fb' WHERE "facultyId" = 'fac_13a1041ab1e64b2a888f';
UPDATE "Faculty" SET id = 'fac_f3b38ac22be140cdb9fb' WHERE id = 'fac_13a1041ab1e64b2a888f';
UPDATE "Program" SET "facultyId" = 'fac_2389612ba8fc4bf2a866' WHERE "facultyId" = 'fac_051f3663b33048888b81';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2389612ba8fc4bf2a866' WHERE "facultyId" = 'fac_051f3663b33048888b81';
UPDATE "Faculty" SET id = 'fac_2389612ba8fc4bf2a866' WHERE id = 'fac_051f3663b33048888b81';
UPDATE "Program" SET "facultyId" = 'fac_cf84e73ce5db4c009f76' WHERE "facultyId" = 'fac_dfd65366986d4cd6a77a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_cf84e73ce5db4c009f76' WHERE "facultyId" = 'fac_dfd65366986d4cd6a77a';
UPDATE "Faculty" SET id = 'fac_cf84e73ce5db4c009f76' WHERE id = 'fac_dfd65366986d4cd6a77a';
UPDATE "Program" SET "facultyId" = 'fac_86c48120eff14b35ac9a' WHERE "facultyId" = 'fac_45281285a4d6411bb359';
UPDATE "MinimumScore" SET "facultyId" = 'fac_86c48120eff14b35ac9a' WHERE "facultyId" = 'fac_45281285a4d6411bb359';
UPDATE "Faculty" SET id = 'fac_86c48120eff14b35ac9a' WHERE id = 'fac_45281285a4d6411bb359';
UPDATE "Program" SET "facultyId" = 'fac_9065cc256c784a389894' WHERE "facultyId" = 'fac_6651c506c5e941e7822c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9065cc256c784a389894' WHERE "facultyId" = 'fac_6651c506c5e941e7822c';
UPDATE "Faculty" SET id = 'fac_9065cc256c784a389894' WHERE id = 'fac_6651c506c5e941e7822c';
UPDATE "Program" SET "facultyId" = 'fac_8d096abdbf9d4d7a97d5' WHERE "facultyId" = 'fac_6fabf9d4ebff403c84f4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_8d096abdbf9d4d7a97d5' WHERE "facultyId" = 'fac_6fabf9d4ebff403c84f4';
UPDATE "Faculty" SET id = 'fac_8d096abdbf9d4d7a97d5' WHERE id = 'fac_6fabf9d4ebff403c84f4';
UPDATE "Program" SET "facultyId" = 'fac_1b574bfc860c4640921d' WHERE "facultyId" = 'fac_25385747c5114c4fb86d';
UPDATE "MinimumScore" SET "facultyId" = 'fac_1b574bfc860c4640921d' WHERE "facultyId" = 'fac_25385747c5114c4fb86d';
UPDATE "Faculty" SET id = 'fac_1b574bfc860c4640921d' WHERE id = 'fac_25385747c5114c4fb86d';
UPDATE "Program" SET "facultyId" = 'fac_9a10ec5dd93a487f90c4' WHERE "facultyId" = 'fac_a7a3b2a0fb684328bef5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9a10ec5dd93a487f90c4' WHERE "facultyId" = 'fac_a7a3b2a0fb684328bef5';
UPDATE "Faculty" SET id = 'fac_9a10ec5dd93a487f90c4' WHERE id = 'fac_a7a3b2a0fb684328bef5';
UPDATE "Program" SET "facultyId" = 'fac_91d76fbae5644810a253' WHERE "facultyId" = 'fac_c998185c13244156a664';
UPDATE "MinimumScore" SET "facultyId" = 'fac_91d76fbae5644810a253' WHERE "facultyId" = 'fac_c998185c13244156a664';
UPDATE "Faculty" SET id = 'fac_91d76fbae5644810a253' WHERE id = 'fac_c998185c13244156a664';
UPDATE "Program" SET "facultyId" = 'fac_ed1ae976a0b84c839a7b' WHERE "facultyId" = 'fac_bb7bc77cd5d74700ace2';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ed1ae976a0b84c839a7b' WHERE "facultyId" = 'fac_bb7bc77cd5d74700ace2';
UPDATE "Faculty" SET id = 'fac_ed1ae976a0b84c839a7b' WHERE id = 'fac_bb7bc77cd5d74700ace2';
UPDATE "Program" SET "facultyId" = 'fac_58bb80c6892941029f58' WHERE "facultyId" = 'fac_da4fbf8b279b435c867e';
UPDATE "MinimumScore" SET "facultyId" = 'fac_58bb80c6892941029f58' WHERE "facultyId" = 'fac_da4fbf8b279b435c867e';
UPDATE "Faculty" SET id = 'fac_58bb80c6892941029f58' WHERE id = 'fac_da4fbf8b279b435c867e';
UPDATE "Program" SET "facultyId" = 'fac_507bf58253374db8ac2e' WHERE "facultyId" = 'fac_11fff49dc7564588b866';
UPDATE "MinimumScore" SET "facultyId" = 'fac_507bf58253374db8ac2e' WHERE "facultyId" = 'fac_11fff49dc7564588b866';
UPDATE "Faculty" SET id = 'fac_507bf58253374db8ac2e' WHERE id = 'fac_11fff49dc7564588b866';
UPDATE "Program" SET "facultyId" = 'fac_87b5c6166c7148ff8415' WHERE "facultyId" = 'fac_42460b32ec3e4edcae97';
UPDATE "MinimumScore" SET "facultyId" = 'fac_87b5c6166c7148ff8415' WHERE "facultyId" = 'fac_42460b32ec3e4edcae97';
UPDATE "Faculty" SET id = 'fac_87b5c6166c7148ff8415' WHERE id = 'fac_42460b32ec3e4edcae97';
UPDATE "Program" SET "facultyId" = 'fac_bbffcdf9b4404aeb9f86' WHERE "facultyId" = 'fac_2b207c6c0231423c9a69';
UPDATE "MinimumScore" SET "facultyId" = 'fac_bbffcdf9b4404aeb9f86' WHERE "facultyId" = 'fac_2b207c6c0231423c9a69';
UPDATE "Faculty" SET id = 'fac_bbffcdf9b4404aeb9f86' WHERE id = 'fac_2b207c6c0231423c9a69';
UPDATE "Program" SET "facultyId" = 'fac_b4dcab4637f94c6b952c' WHERE "facultyId" = 'fac_e679786719394cdc8a14';
UPDATE "MinimumScore" SET "facultyId" = 'fac_b4dcab4637f94c6b952c' WHERE "facultyId" = 'fac_e679786719394cdc8a14';
UPDATE "Faculty" SET id = 'fac_b4dcab4637f94c6b952c' WHERE id = 'fac_e679786719394cdc8a14';
UPDATE "Program" SET "facultyId" = 'fac_e99683e3416948ccace7' WHERE "facultyId" = 'fac_dd4692f54b254e3dba4b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e99683e3416948ccace7' WHERE "facultyId" = 'fac_dd4692f54b254e3dba4b';
UPDATE "Faculty" SET id = 'fac_e99683e3416948ccace7' WHERE id = 'fac_dd4692f54b254e3dba4b';
UPDATE "Program" SET "facultyId" = 'fac_001bad161e7e4062908d' WHERE "facultyId" = 'fac_190b8df521784adfb00b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_001bad161e7e4062908d' WHERE "facultyId" = 'fac_190b8df521784adfb00b';
UPDATE "Faculty" SET id = 'fac_001bad161e7e4062908d' WHERE id = 'fac_190b8df521784adfb00b';
UPDATE "Program" SET "facultyId" = 'fac_c41c26116ea04377ae92' WHERE "facultyId" = 'fac_1b0db8aa26a948c38d8f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_c41c26116ea04377ae92' WHERE "facultyId" = 'fac_1b0db8aa26a948c38d8f';
UPDATE "Faculty" SET id = 'fac_c41c26116ea04377ae92' WHERE id = 'fac_1b0db8aa26a948c38d8f';
UPDATE "Program" SET "facultyId" = 'fac_6eedfa401f2f4dd09d53' WHERE "facultyId" = 'fac_025d028b4a83448a9399';
UPDATE "MinimumScore" SET "facultyId" = 'fac_6eedfa401f2f4dd09d53' WHERE "facultyId" = 'fac_025d028b4a83448a9399';
UPDATE "Faculty" SET id = 'fac_6eedfa401f2f4dd09d53' WHERE id = 'fac_025d028b4a83448a9399';
UPDATE "Program" SET "facultyId" = 'fac_50c0e6ad21754956b902' WHERE "facultyId" = 'fac_9319f1256fa34eac81a1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_50c0e6ad21754956b902' WHERE "facultyId" = 'fac_9319f1256fa34eac81a1';
UPDATE "Faculty" SET id = 'fac_50c0e6ad21754956b902' WHERE id = 'fac_9319f1256fa34eac81a1';
UPDATE "Program" SET "facultyId" = 'fac_2b7829508fa94396b81b' WHERE "facultyId" = 'fac_651b0e073108474d8d9a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_2b7829508fa94396b81b' WHERE "facultyId" = 'fac_651b0e073108474d8d9a';
UPDATE "Faculty" SET id = 'fac_2b7829508fa94396b81b' WHERE id = 'fac_651b0e073108474d8d9a';
UPDATE "Program" SET "facultyId" = 'fac_1b54226c12d2496e9ea0' WHERE "facultyId" = 'fac_bf164c9a0cbe48749ef7';
UPDATE "MinimumScore" SET "facultyId" = 'fac_1b54226c12d2496e9ea0' WHERE "facultyId" = 'fac_bf164c9a0cbe48749ef7';
UPDATE "Faculty" SET id = 'fac_1b54226c12d2496e9ea0' WHERE id = 'fac_bf164c9a0cbe48749ef7';
UPDATE "Program" SET "facultyId" = 'fac_79fc1acc668c4b49b661' WHERE "facultyId" = 'fac_5ca4a22f2436409baf8e';
UPDATE "MinimumScore" SET "facultyId" = 'fac_79fc1acc668c4b49b661' WHERE "facultyId" = 'fac_5ca4a22f2436409baf8e';
UPDATE "Faculty" SET id = 'fac_79fc1acc668c4b49b661' WHERE id = 'fac_5ca4a22f2436409baf8e';
UPDATE "Program" SET "facultyId" = 'fac_af124f7888104c34be9d' WHERE "facultyId" = 'fac_83eae1bf4c5046eebb3b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_af124f7888104c34be9d' WHERE "facultyId" = 'fac_83eae1bf4c5046eebb3b';
UPDATE "Faculty" SET id = 'fac_af124f7888104c34be9d' WHERE id = 'fac_83eae1bf4c5046eebb3b';
UPDATE "Program" SET "facultyId" = 'fac_f9eb3a1855164d89841f' WHERE "facultyId" = 'fac_16ed5a4f0efd4ad2b33c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f9eb3a1855164d89841f' WHERE "facultyId" = 'fac_16ed5a4f0efd4ad2b33c';
UPDATE "Faculty" SET id = 'fac_f9eb3a1855164d89841f' WHERE id = 'fac_16ed5a4f0efd4ad2b33c';
UPDATE "Program" SET "facultyId" = 'fac_97b39c164c554d2687ec' WHERE "facultyId" = 'fac_84a158ce909940ebbfa5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_97b39c164c554d2687ec' WHERE "facultyId" = 'fac_84a158ce909940ebbfa5';
UPDATE "Faculty" SET id = 'fac_97b39c164c554d2687ec' WHERE id = 'fac_84a158ce909940ebbfa5';
UPDATE "Program" SET "facultyId" = 'fac_f16238cf74a34d91aeeb' WHERE "facultyId" = 'fac_fce270f2eaaf486ca2b8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f16238cf74a34d91aeeb' WHERE "facultyId" = 'fac_fce270f2eaaf486ca2b8';
UPDATE "Faculty" SET id = 'fac_f16238cf74a34d91aeeb' WHERE id = 'fac_fce270f2eaaf486ca2b8';
UPDATE "Program" SET "facultyId" = 'fac_fb488eb07e634b2e9437' WHERE "facultyId" = 'fac_1889f8b1a60f4d168b22';
UPDATE "MinimumScore" SET "facultyId" = 'fac_fb488eb07e634b2e9437' WHERE "facultyId" = 'fac_1889f8b1a60f4d168b22';
UPDATE "Faculty" SET id = 'fac_fb488eb07e634b2e9437' WHERE id = 'fac_1889f8b1a60f4d168b22';
UPDATE "Program" SET "facultyId" = 'fac_ca4c7d901ea44d71b3ec' WHERE "facultyId" = 'fac_be8b9b822aed4d458d83';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ca4c7d901ea44d71b3ec' WHERE "facultyId" = 'fac_be8b9b822aed4d458d83';
UPDATE "Faculty" SET id = 'fac_ca4c7d901ea44d71b3ec' WHERE id = 'fac_be8b9b822aed4d458d83';
UPDATE "Program" SET "facultyId" = 'fac_741fb7a9ec8343a095fe' WHERE "facultyId" = 'fac_358143b214a042d78d0f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_741fb7a9ec8343a095fe' WHERE "facultyId" = 'fac_358143b214a042d78d0f';
UPDATE "Faculty" SET id = 'fac_741fb7a9ec8343a095fe' WHERE id = 'fac_358143b214a042d78d0f';
UPDATE "Program" SET "facultyId" = 'fac_230cf7cec1914bdba251' WHERE "facultyId" = 'fac_5d1c9ad9c441401eaed7';
UPDATE "MinimumScore" SET "facultyId" = 'fac_230cf7cec1914bdba251' WHERE "facultyId" = 'fac_5d1c9ad9c441401eaed7';
UPDATE "Faculty" SET id = 'fac_230cf7cec1914bdba251' WHERE id = 'fac_5d1c9ad9c441401eaed7';
UPDATE "Program" SET "facultyId" = 'fac_9e180ee5d0e5464eb5de' WHERE "facultyId" = 'fac_91cbad7fb92a49b0bec6';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9e180ee5d0e5464eb5de' WHERE "facultyId" = 'fac_91cbad7fb92a49b0bec6';
UPDATE "Faculty" SET id = 'fac_9e180ee5d0e5464eb5de' WHERE id = 'fac_91cbad7fb92a49b0bec6';
UPDATE "Program" SET "facultyId" = 'fac_7ecb7574668a43c78160' WHERE "facultyId" = 'fac_5b7586e877be4f938f88';
UPDATE "MinimumScore" SET "facultyId" = 'fac_7ecb7574668a43c78160' WHERE "facultyId" = 'fac_5b7586e877be4f938f88';
UPDATE "Faculty" SET id = 'fac_7ecb7574668a43c78160' WHERE id = 'fac_5b7586e877be4f938f88';
UPDATE "Program" SET "facultyId" = 'fac_f96f13d56a5a4247afa1' WHERE "facultyId" = 'fac_734ab7581a824c51b5a1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f96f13d56a5a4247afa1' WHERE "facultyId" = 'fac_734ab7581a824c51b5a1';
UPDATE "Faculty" SET id = 'fac_f96f13d56a5a4247afa1' WHERE id = 'fac_734ab7581a824c51b5a1';
UPDATE "Program" SET "facultyId" = 'fac_b3bf3f074d354379a770' WHERE "facultyId" = 'fac_b6cf894fb802403d904e';
UPDATE "MinimumScore" SET "facultyId" = 'fac_b3bf3f074d354379a770' WHERE "facultyId" = 'fac_b6cf894fb802403d904e';
UPDATE "Faculty" SET id = 'fac_b3bf3f074d354379a770' WHERE id = 'fac_b6cf894fb802403d904e';
UPDATE "Program" SET "facultyId" = 'fac_301e103e640146f9bb3f' WHERE "facultyId" = 'fac_48b5ef7f90a94bd09c04';
UPDATE "MinimumScore" SET "facultyId" = 'fac_301e103e640146f9bb3f' WHERE "facultyId" = 'fac_48b5ef7f90a94bd09c04';
UPDATE "Faculty" SET id = 'fac_301e103e640146f9bb3f' WHERE id = 'fac_48b5ef7f90a94bd09c04';
UPDATE "Program" SET "facultyId" = 'fac_77566d456e574e0d9913' WHERE "facultyId" = 'fac_0722e9fa67c246499275';
UPDATE "MinimumScore" SET "facultyId" = 'fac_77566d456e574e0d9913' WHERE "facultyId" = 'fac_0722e9fa67c246499275';
UPDATE "Faculty" SET id = 'fac_77566d456e574e0d9913' WHERE id = 'fac_0722e9fa67c246499275';
UPDATE "Program" SET "facultyId" = 'fac_6a90d874079c4950abef' WHERE "facultyId" = 'fac_356b33490e574c9d8684';
UPDATE "MinimumScore" SET "facultyId" = 'fac_6a90d874079c4950abef' WHERE "facultyId" = 'fac_356b33490e574c9d8684';
UPDATE "Faculty" SET id = 'fac_6a90d874079c4950abef' WHERE id = 'fac_356b33490e574c9d8684';
UPDATE "Program" SET "facultyId" = 'fac_85c8be61b42043ea827a' WHERE "facultyId" = 'fac_0dd91efc420443269adb';
UPDATE "MinimumScore" SET "facultyId" = 'fac_85c8be61b42043ea827a' WHERE "facultyId" = 'fac_0dd91efc420443269adb';
UPDATE "Faculty" SET id = 'fac_85c8be61b42043ea827a' WHERE id = 'fac_0dd91efc420443269adb';
UPDATE "Program" SET "facultyId" = 'fac_660916dcae2243a78685' WHERE "facultyId" = 'fac_ad9e1d37e03348c59bc8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_660916dcae2243a78685' WHERE "facultyId" = 'fac_ad9e1d37e03348c59bc8';
UPDATE "Faculty" SET id = 'fac_660916dcae2243a78685' WHERE id = 'fac_ad9e1d37e03348c59bc8';
UPDATE "Program" SET "facultyId" = 'fac_e561b3d06dec48e58937' WHERE "facultyId" = 'fac_c68e760b896a43178c81';
UPDATE "MinimumScore" SET "facultyId" = 'fac_e561b3d06dec48e58937' WHERE "facultyId" = 'fac_c68e760b896a43178c81';
UPDATE "Faculty" SET id = 'fac_e561b3d06dec48e58937' WHERE id = 'fac_c68e760b896a43178c81';
UPDATE "Program" SET "facultyId" = 'fac_f1cab98715d04c96903d' WHERE "facultyId" = 'fac_fbd9b1a0796648a2b80f';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f1cab98715d04c96903d' WHERE "facultyId" = 'fac_fbd9b1a0796648a2b80f';
UPDATE "Faculty" SET id = 'fac_f1cab98715d04c96903d' WHERE id = 'fac_fbd9b1a0796648a2b80f';
UPDATE "Program" SET "facultyId" = 'fac_4419ea4950d7421aa164' WHERE "facultyId" = 'fac_d794164bb1284f45984a';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4419ea4950d7421aa164' WHERE "facultyId" = 'fac_d794164bb1284f45984a';
UPDATE "Faculty" SET id = 'fac_4419ea4950d7421aa164' WHERE id = 'fac_d794164bb1284f45984a';
UPDATE "Program" SET "facultyId" = 'fac_adc33b86ed39430389d9' WHERE "facultyId" = 'fac_debe699d31fe4e079558';
UPDATE "MinimumScore" SET "facultyId" = 'fac_adc33b86ed39430389d9' WHERE "facultyId" = 'fac_debe699d31fe4e079558';
UPDATE "Faculty" SET id = 'fac_adc33b86ed39430389d9' WHERE id = 'fac_debe699d31fe4e079558';
UPDATE "Program" SET "facultyId" = 'fac_cba3833b1a4d4f3cb847' WHERE "facultyId" = 'fac_470db7bfd3294d6d8c67';
UPDATE "MinimumScore" SET "facultyId" = 'fac_cba3833b1a4d4f3cb847' WHERE "facultyId" = 'fac_470db7bfd3294d6d8c67';
UPDATE "Faculty" SET id = 'fac_cba3833b1a4d4f3cb847' WHERE id = 'fac_470db7bfd3294d6d8c67';
UPDATE "Program" SET "facultyId" = 'fac_0ddf952433b945ba895a' WHERE "facultyId" = 'fac_e80bde2628504e1bbdd0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0ddf952433b945ba895a' WHERE "facultyId" = 'fac_e80bde2628504e1bbdd0';
UPDATE "Faculty" SET id = 'fac_0ddf952433b945ba895a' WHERE id = 'fac_e80bde2628504e1bbdd0';
UPDATE "Program" SET "facultyId" = 'fac_074d170046ce425aab54' WHERE "facultyId" = 'fac_730fcf8354514fa4953c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_074d170046ce425aab54' WHERE "facultyId" = 'fac_730fcf8354514fa4953c';
UPDATE "Faculty" SET id = 'fac_074d170046ce425aab54' WHERE id = 'fac_730fcf8354514fa4953c';
UPDATE "Program" SET "facultyId" = 'fac_d7dc6bc7ab6845049945' WHERE "facultyId" = 'fac_3b9a40ec4a5b4adaaf1b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d7dc6bc7ab6845049945' WHERE "facultyId" = 'fac_3b9a40ec4a5b4adaaf1b';
UPDATE "Faculty" SET id = 'fac_d7dc6bc7ab6845049945' WHERE id = 'fac_3b9a40ec4a5b4adaaf1b';
UPDATE "Program" SET "facultyId" = 'fac_4ce799d566ca458e93cc' WHERE "facultyId" = 'fac_5fdc24515a564e90bb1c';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4ce799d566ca458e93cc' WHERE "facultyId" = 'fac_5fdc24515a564e90bb1c';
UPDATE "Faculty" SET id = 'fac_4ce799d566ca458e93cc' WHERE id = 'fac_5fdc24515a564e90bb1c';
UPDATE "Program" SET "facultyId" = 'fac_cec34a00fa634698a67a' WHERE "facultyId" = 'fac_6d22f3e85102475b885b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_cec34a00fa634698a67a' WHERE "facultyId" = 'fac_6d22f3e85102475b885b';
UPDATE "Faculty" SET id = 'fac_cec34a00fa634698a67a' WHERE id = 'fac_6d22f3e85102475b885b';
UPDATE "Program" SET "facultyId" = 'fac_ea730702fd1e4fee9028' WHERE "facultyId" = 'fac_e31d27b6ddaa432fa495';
UPDATE "MinimumScore" SET "facultyId" = 'fac_ea730702fd1e4fee9028' WHERE "facultyId" = 'fac_e31d27b6ddaa432fa495';
UPDATE "Faculty" SET id = 'fac_ea730702fd1e4fee9028' WHERE id = 'fac_e31d27b6ddaa432fa495';
UPDATE "Program" SET "facultyId" = 'fac_bbef57ae056a4f2cbeae' WHERE "facultyId" = 'fac_6d3a054d985b48fcb789';
UPDATE "MinimumScore" SET "facultyId" = 'fac_bbef57ae056a4f2cbeae' WHERE "facultyId" = 'fac_6d3a054d985b48fcb789';
UPDATE "Faculty" SET id = 'fac_bbef57ae056a4f2cbeae' WHERE id = 'fac_6d3a054d985b48fcb789';
UPDATE "Program" SET "facultyId" = 'fac_354d991529bc41ae8d1a' WHERE "facultyId" = 'fac_b893ca7b8a1149fabbe0';
UPDATE "MinimumScore" SET "facultyId" = 'fac_354d991529bc41ae8d1a' WHERE "facultyId" = 'fac_b893ca7b8a1149fabbe0';
UPDATE "Faculty" SET id = 'fac_354d991529bc41ae8d1a' WHERE id = 'fac_b893ca7b8a1149fabbe0';
UPDATE "Program" SET "facultyId" = 'fac_22f1a9f2fcba49ff83be' WHERE "facultyId" = 'fac_ad091670a99245c8b7b3';
UPDATE "MinimumScore" SET "facultyId" = 'fac_22f1a9f2fcba49ff83be' WHERE "facultyId" = 'fac_ad091670a99245c8b7b3';
UPDATE "Faculty" SET id = 'fac_22f1a9f2fcba49ff83be' WHERE id = 'fac_ad091670a99245c8b7b3';
UPDATE "Program" SET "facultyId" = 'fac_62bbad8883b243fa8845' WHERE "facultyId" = 'fac_44ea05cb24b04b6fbbc8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_62bbad8883b243fa8845' WHERE "facultyId" = 'fac_44ea05cb24b04b6fbbc8';
UPDATE "Faculty" SET id = 'fac_62bbad8883b243fa8845' WHERE id = 'fac_44ea05cb24b04b6fbbc8';
UPDATE "Program" SET "facultyId" = 'fac_f8aff889c5e34fdeb1d0' WHERE "facultyId" = 'fac_38df85c8b18440c09f32';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f8aff889c5e34fdeb1d0' WHERE "facultyId" = 'fac_38df85c8b18440c09f32';
UPDATE "Faculty" SET id = 'fac_f8aff889c5e34fdeb1d0' WHERE id = 'fac_38df85c8b18440c09f32';
UPDATE "Program" SET "facultyId" = 'fac_3b23c494eee64019b661' WHERE "facultyId" = 'fac_778e9076c71e41cf9cb4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_3b23c494eee64019b661' WHERE "facultyId" = 'fac_778e9076c71e41cf9cb4';
UPDATE "Faculty" SET id = 'fac_3b23c494eee64019b661' WHERE id = 'fac_778e9076c71e41cf9cb4';
UPDATE "Program" SET "facultyId" = 'fac_75c9757dc9cb429cb84a' WHERE "facultyId" = 'fac_39fc0d3af4524376b1d8';
UPDATE "MinimumScore" SET "facultyId" = 'fac_75c9757dc9cb429cb84a' WHERE "facultyId" = 'fac_39fc0d3af4524376b1d8';
UPDATE "Faculty" SET id = 'fac_75c9757dc9cb429cb84a' WHERE id = 'fac_39fc0d3af4524376b1d8';
UPDATE "Program" SET "facultyId" = 'fac_0d9094159402404fa238' WHERE "facultyId" = 'fac_94202fc6947740bab7ae';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0d9094159402404fa238' WHERE "facultyId" = 'fac_94202fc6947740bab7ae';
UPDATE "Faculty" SET id = 'fac_0d9094159402404fa238' WHERE id = 'fac_94202fc6947740bab7ae';
UPDATE "Program" SET "facultyId" = 'fac_4789faef9b004483a5df' WHERE "facultyId" = 'fac_e4ab80ffecbf43479e17';
UPDATE "MinimumScore" SET "facultyId" = 'fac_4789faef9b004483a5df' WHERE "facultyId" = 'fac_e4ab80ffecbf43479e17';
UPDATE "Faculty" SET id = 'fac_4789faef9b004483a5df' WHERE id = 'fac_e4ab80ffecbf43479e17';
UPDATE "Program" SET "facultyId" = 'fac_0901078a02644bf0afa6' WHERE "facultyId" = 'fac_3eae41f5f29c479698d1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0901078a02644bf0afa6' WHERE "facultyId" = 'fac_3eae41f5f29c479698d1';
UPDATE "Faculty" SET id = 'fac_0901078a02644bf0afa6' WHERE id = 'fac_3eae41f5f29c479698d1';
UPDATE "Program" SET "facultyId" = 'fac_c2ab84ab54ba4a0c8225' WHERE "facultyId" = 'fac_4aa64a6d4f81421ca6fb';
UPDATE "MinimumScore" SET "facultyId" = 'fac_c2ab84ab54ba4a0c8225' WHERE "facultyId" = 'fac_4aa64a6d4f81421ca6fb';
UPDATE "Faculty" SET id = 'fac_c2ab84ab54ba4a0c8225' WHERE id = 'fac_4aa64a6d4f81421ca6fb';
UPDATE "Program" SET "facultyId" = 'fac_9d6e61a464c84f1e8e0d' WHERE "facultyId" = 'fac_09d04f361a904b7fbecd';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9d6e61a464c84f1e8e0d' WHERE "facultyId" = 'fac_09d04f361a904b7fbecd';
UPDATE "Faculty" SET id = 'fac_9d6e61a464c84f1e8e0d' WHERE id = 'fac_09d04f361a904b7fbecd';
UPDATE "Program" SET "facultyId" = 'fac_3b7e3216c7d14fdf8072' WHERE "facultyId" = 'fac_9f6525bbad6f42a8b663';
UPDATE "MinimumScore" SET "facultyId" = 'fac_3b7e3216c7d14fdf8072' WHERE "facultyId" = 'fac_9f6525bbad6f42a8b663';
UPDATE "Faculty" SET id = 'fac_3b7e3216c7d14fdf8072' WHERE id = 'fac_9f6525bbad6f42a8b663';
UPDATE "Program" SET "facultyId" = 'fac_067b4d2bab7347bdb466' WHERE "facultyId" = 'fac_063063c631c6417cb7fd';
UPDATE "MinimumScore" SET "facultyId" = 'fac_067b4d2bab7347bdb466' WHERE "facultyId" = 'fac_063063c631c6417cb7fd';
UPDATE "Faculty" SET id = 'fac_067b4d2bab7347bdb466' WHERE id = 'fac_063063c631c6417cb7fd';
UPDATE "Program" SET "facultyId" = 'fac_9b1cd421d241453698fe' WHERE "facultyId" = 'fac_36d30e65cf244f96bded';
UPDATE "MinimumScore" SET "facultyId" = 'fac_9b1cd421d241453698fe' WHERE "facultyId" = 'fac_36d30e65cf244f96bded';
UPDATE "Faculty" SET id = 'fac_9b1cd421d241453698fe' WHERE id = 'fac_36d30e65cf244f96bded';
UPDATE "Program" SET "facultyId" = 'fac_c2e7aaa7cd024ddf9ff0' WHERE "facultyId" = 'fac_bfffdcc5c9fd491eba49';
UPDATE "MinimumScore" SET "facultyId" = 'fac_c2e7aaa7cd024ddf9ff0' WHERE "facultyId" = 'fac_bfffdcc5c9fd491eba49';
UPDATE "Faculty" SET id = 'fac_c2e7aaa7cd024ddf9ff0' WHERE id = 'fac_bfffdcc5c9fd491eba49';
UPDATE "Program" SET "facultyId" = 'fac_f3ec01071cda41ed8226' WHERE "facultyId" = 'fac_d0af71a5ec9b4a959b46';
UPDATE "MinimumScore" SET "facultyId" = 'fac_f3ec01071cda41ed8226' WHERE "facultyId" = 'fac_d0af71a5ec9b4a959b46';
UPDATE "Faculty" SET id = 'fac_f3ec01071cda41ed8226' WHERE id = 'fac_d0af71a5ec9b4a959b46';
UPDATE "Program" SET "facultyId" = 'fac_0ae7a781813e468b95c5' WHERE "facultyId" = 'fac_2bb155b6fef24960b08b';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0ae7a781813e468b95c5' WHERE "facultyId" = 'fac_2bb155b6fef24960b08b';
UPDATE "Faculty" SET id = 'fac_0ae7a781813e468b95c5' WHERE id = 'fac_2bb155b6fef24960b08b';
UPDATE "Program" SET "facultyId" = 'fac_5e3dddf9563d403b96da' WHERE "facultyId" = 'fac_9523642c7dc644d5b2e4';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5e3dddf9563d403b96da' WHERE "facultyId" = 'fac_9523642c7dc644d5b2e4';
UPDATE "Faculty" SET id = 'fac_5e3dddf9563d403b96da' WHERE id = 'fac_9523642c7dc644d5b2e4';
UPDATE "Program" SET "facultyId" = 'fac_d26afb6bb5b84a56aa61' WHERE "facultyId" = 'fac_79f8062eefc6491d8be3';
UPDATE "MinimumScore" SET "facultyId" = 'fac_d26afb6bb5b84a56aa61' WHERE "facultyId" = 'fac_79f8062eefc6491d8be3';
UPDATE "Faculty" SET id = 'fac_d26afb6bb5b84a56aa61' WHERE id = 'fac_79f8062eefc6491d8be3';
UPDATE "Program" SET "facultyId" = 'fac_5b2b559e3ecb41b9834e' WHERE "facultyId" = 'fac_c8206bfb998141f3bfa1';
UPDATE "MinimumScore" SET "facultyId" = 'fac_5b2b559e3ecb41b9834e' WHERE "facultyId" = 'fac_c8206bfb998141f3bfa1';
UPDATE "Faculty" SET id = 'fac_5b2b559e3ecb41b9834e' WHERE id = 'fac_c8206bfb998141f3bfa1';
UPDATE "Program" SET "facultyId" = 'fac_0e9f1687c18049c89231' WHERE "facultyId" = 'fac_9c8199f6cf5b419d8fb5';
UPDATE "MinimumScore" SET "facultyId" = 'fac_0e9f1687c18049c89231' WHERE "facultyId" = 'fac_9c8199f6cf5b419d8fb5';
UPDATE "Faculty" SET id = 'fac_0e9f1687c18049c89231' WHERE id = 'fac_9c8199f6cf5b419d8fb5';
UPDATE "Program" SET "facultyId" = 'fac_bd738eeaf6df47a5a5da' WHERE "facultyId" = 'fac_8da97f39a03c4433b926';
UPDATE "MinimumScore" SET "facultyId" = 'fac_bd738eeaf6df47a5a5da' WHERE "facultyId" = 'fac_8da97f39a03c4433b926';
UPDATE "Faculty" SET id = 'fac_bd738eeaf6df47a5a5da' WHERE id = 'fac_8da97f39a03c4433b926';

-- ===== prisma/seed/university-descriptions-2026-10-08.sql
-- University descriptions, rewritten for all 51 universities from the
-- client-supplied Arabic sheet ("وصف الجامعات.xlsx", 2026-10-08). The Arabic
-- is the sheet's text with only markdown markers and three missing spaces
-- fixed; the English is a translation of it, with no facts added.


UPDATE "University" SET description = 'The Egyptian Chinese University is a private university in Egypt offering education that combines academic study with practical application, drawing on Chinese expertise and experience in education and technology. The university focuses on preparing students for the job market through hands-on training and the development of professional skills. Its programs span a range of fields, including engineering, information technology, economics and physical therapy, among others. It also emphasizes innovation and entrepreneurship, providing a learning environment that helps students build their skills and get ready for the demands of the job market.',
  "descriptionAr" = 'الجامعة المصرية الصينية هي جامعة خاصة في مصر تقدم تعليما يجمع بين الدراسة الأكاديمية والتطبيق العملي، مع الاستفادة من الخبرات والتجربة الصينية في مجالات التعليم والتكنولوجيا. تهتم الجامعة بتأهيل الطلاب لسوق العمل من خلال التدريب العملي وتنمية المهارات المهنية. وتضم برامج دراسية في مجالات متنوعة، من بينها الهندسة، وتكنولوجيا المعلومات، والاقتصاد، والعلاج الطبيعي، وغيرها. كما تركز على الابتكار وريادة الأعمال، وتوفير بيئة تعليمية تساعد الطلاب على تطوير مهاراتهم والاستعداد لمتطلبات سوق العمل.'
WHERE slug = 'egyptian-chinese-university';

UPDATE "University" SET description = 'May University in Cairo is a private university founded in 2019 in 15th of May City, Cairo. It offers academic programs across a range of fields, including engineering; politics, economics and business administration; physical therapy; nursing; and technology. The university focuses on combining academic knowledge with practical application, developing critical and creative thinking skills, and linking education to the needs of the job market. It also provides a learning environment built on modern technology and hands-on training, alongside student activities and international academic cooperation.',
  "descriptionAr" = 'جامعة مايو بالقاهرة هي جامعة خاصة تأسست عام 2019 وتقع في مدينة 15 مايو بالقاهرة. تقدم الجامعة برامج أكاديمية في مجالات متنوعة تشمل الهندسة، والسياسة والاقتصاد وإدارة الأعمال، والعلاج الطبيعي، والتمريض، والتكنولوجيا. وتركز الجامعة على الجمع بين المعرفة الأكاديمية والتطبيق العملي، مع الاهتمام بتنمية مهارات التفكير النقدي والإبداعي وربط التعليم باحتياجات سوق العمل. كما توفر بيئة تعليمية تعتمد على التقنيات الحديثة والتدريب العملي، إلى جانب الأنشطة الطلابية والتعاون الأكاديمي الدولي.'
WHERE slug = 'may-university-in-cairo';

UPDATE "University" SET description = 'The Egyptian Russian University is a private university founded in 2006 in Badr City, Cairo. It offers academic programs across a range of fields, including engineering, pharmacy, dentistry, management, and computers and information technology. The university combines academic study with practical application, with a focus on building skills and linking education to the needs of the job market. It is also distinguished by its academic cooperation with a number of Russian universities, giving students opportunities to study and train in Russia through some programs and agreements. The university also places emphasis on innovation, student activities and professional development.',
  "descriptionAr" = 'الجامعة المصرية الروسية هي جامعة خاصة تأسست عام 2006 وتقع في مدينة بدر بالقاهرة. تقدم الجامعة برامج أكاديمية في مجالات متنوعة تشمل الهندسة، والصيدلة، وطب الفم والأسنان، والإدارة، وتكنولوجيا المعلومات والحاسبات. وتعتمد الجامعة على الجمع بين الدراسة الأكاديمية والتطبيق العملي، مع اهتمام بتنمية المهارات وربط التعليم باحتياجات سوق العمل. كما تتميز بالتعاون الأكاديمي مع عدد من الجامعات الروسية، وتوفر لطلابها فرصا للدراسة والتدريب في روسيا ضمن بعض البرامج والاتفاقيات. وتهتم الجامعة أيضا بالابتكار والأنشطة الطلابية والتطوير المهني.'
WHERE slug = 'egyptian-russian-university';

UPDATE "University" SET description = 'Hertfordshire University Egypt offers academic programs in partnership with the UK''s University of Hertfordshire, giving students a learning experience based on the British model of study. It offers programs in business administration, computer science and mechanical engineering, combining academic study with practical application. The programs focus on developing scientific and professional skills and preparing students for the demands of the job market. The university also provides a learning environment with labs and facilities that support hands-on training, and students can earn a degree linked to the University of Hertfordshire in the UK.',
  "descriptionAr" = 'جامعة هيرتفوردشاير في مصر هي جامعة تقدم برامج أكاديمية بالتعاون مع جامعة هيرتفوردشاير البريطانية، وتوفر للطلاب تجربة تعليمية تعتمد على النموذج البريطاني في الدراسة. تضم الجامعة برامج في مجالات إدارة الأعمال، وعلوم الكمبيوتر، والهندسة الميكانيكية، مع الجمع بين الدراسة الأكاديمية والتطبيق العملي. وتركز البرامج على تنمية المهارات العلمية والمهنية وإعداد الطلاب لمتطلبات سوق العمل. كما توفر الجامعة بيئة تعليمية تضم معامل ومرافق تساعد على التدريب العملي، مع إتاحة الحصول على شهادة مرتبطة بجامعة هيرتفوردشاير البريطانية.'
WHERE slug = 'hertfordshire-university-egypt';

UPDATE "University" SET description = 'The German University in Cairo is a private university in Egypt offering education based on the German model, with a focus on academic study, practical application and scientific research. Its programs span a range of fields, including engineering, information technology, computer science, management, pharmacy and biotechnology, design, and dentistry. It provides a learning environment with specialized labs and facilities, along with opportunities for training and academic exchange. Students also study German as part of their programs, with opportunities to study and do research in Germany at certain stages and in certain programs.',
  "descriptionAr" = 'الجامعة الألمانية بالقاهرة هي جامعة خاصة في مصر تقدم تعليما يعتمد على النموذج الألماني، مع التركيز على الدراسة الأكاديمية والتطبيق العملي والبحث العلمي. تضم الجامعة برامج في مجالات متنوعة تشمل الهندسة، وتكنولوجيا المعلومات، وعلوم الحاسب، والإدارة، والصيدلة والتكنولوجيا الحيوية، والتصميم، وطب الأسنان. وتوفر بيئة تعليمية تضم معامل ومرافق متخصصة، إلى جانب فرص للتدريب والتبادل الأكاديمي. كما يدرس الطلاب اللغة الألمانية ضمن برامجهم، مع إتاحة فرص للدراسة والبحث في ألمانيا في بعض المراحل والبرامج.'
WHERE slug = 'german-university-in-cairo-guc';

UPDATE "University" SET description = 'New Giza University is a private university on the Cairo-Alexandria Desert Road, near the Pyramids. Teaching began in 2016, and it offers academic programs across a range of fields, including medicine, dentistry, pharmacy, engineering, information technology, business administration and finance, economics and politics, and arts and design. The university focuses on combining academic knowledge with practical application, and has academic cooperation with international universities and educational institutions. It also provides a learning environment with specialized labs and facilities and spaces for activities and study, with an emphasis on scientific research and professional skills development.',
  "descriptionAr" = 'جامعة الجيزة الجديدة هي جامعة خاصة تقع على طريق القاهرة - الإسكندرية الصحراوي بالقرب من منطقة الأهرامات. بدأت الدراسة بها عام 2016، وتقدم برامج أكاديمية في مجالات متنوعة تشمل الطب، وطب الأسنان، والصيدلة، والهندسة، وتكنولوجيا المعلومات، وإدارة الأعمال والمالية، والاقتصاد والسياسة، والفنون والتصميم. وتركز الجامعة على الجمع بين المعرفة الأكاديمية والتطبيق العملي، مع وجود تعاون أكاديمي مع جامعات ومؤسسات تعليمية دولية. كما توفر الجامعة بيئة تعليمية تضم معامل ومرافق متخصصة ومساحات للأنشطة والدراسة، مع اهتمام بالبحث العلمي وتنمية المهارات المهنية.'
WHERE slug = 'new-giza-university';

UPDATE "University" SET description = 'Badr University in Assiut is a private university in Nasser City, west of Assiut, offering a variety of academic programs across medical, scientific and humanities fields. Its faculties and programs include dentistry, pharmacy, physical therapy, nursing, veterinary medicine, artificial intelligence and data science, biotechnology, health sciences, languages and translation, law, business administration, and applied arts. The university focuses on combining academic study with practical application, with an emphasis on training, skills development and aligning programs with the needs of the job market, alongside student activities and services.',
  "descriptionAr" = 'جامعة بدر بأسيوط هي جامعة خاصة تقع في مدينة ناصر غرب أسيوط، وتقدم برامج أكاديمية متنوعة في عدد من المجالات الطبية والعلمية والإنسانية. تضم الجامعة كليات وبرامج في طب الفم والأسنان، والصيدلة، والعلاج الطبيعي، والتمريض، والطب البيطري، والذكاء الاصطناعي وعلوم البيانات، والتكنولوجيا الحيوية، والعلوم الصحية، واللغات والترجمة، والقانون، وإدارة الأعمال، والفنون التطبيقية. وتركز الجامعة على الجمع بين الدراسة الأكاديمية والتطبيق العملي، مع الاهتمام بالتدريب وتنمية المهارات وربط البرامج باحتياجات سوق العمل، إلى جانب الأنشطة والخدمات الطلابية.'
WHERE slug = 'badr-university-in-assiut';

UPDATE "University" SET description = 'Delta University for Science and Technology is a private university founded in 2007 in Gamasa, Dakahlia Governorate. It offers academic programs across a range of fields, including medicine, dentistry, pharmacy, physical therapy, health sciences, engineering, artificial intelligence, business administration, arts, nursing, and veterinary medicine. The university focuses on combining academic study with practical application, providing labs, training facilities and a university hospital to serve its medical programs. It also values academic cooperation and hands-on training, and offers students opportunities to take part in international activities and educational experiences.',
  "descriptionAr" = 'جامعة الدلتا للعلوم والتكنولوجيا هي جامعة خاصة تأسست عام 2007 وتقع بمدينة جمصة في محافظة الدقهلية. تقدم الجامعة برامج أكاديمية في مجالات متنوعة تشمل الطب، وطب الفم والأسنان، والصيدلة، والعلاج الطبيعي، والعلوم الصحية، والهندسة، والذكاء الاصطناعي، وإدارة الأعمال، والآداب، والتمريض، والطب البيطري. وتركز الجامعة على الجمع بين الدراسة الأكاديمية والتطبيق العملي، مع توفير معامل ومنشآت تدريبية ومستشفى جامعي لخدمة البرامج الطبية. كما تهتم بالتعاون الأكاديمي والتدريب العملي، وتوفر لطلابها فرصا للمشاركة في الأنشطة والتجارب التعليمية الدولية.'
WHERE slug = 'delta-university-for-science-and-technology';

UPDATE "University" SET description = 'Merit University is a private university founded in 2019 in New Sohag City, serving students in Upper Egypt through academic programs in medical, scientific and technological fields. Its faculties include medicine, physical therapy, pharmacy and biotechnology, and its programs are taught in English. Study combines academic work with practical application, with specialized labs and opportunities for training and scientific research. The university also values student activities and skills development, and provides a learning environment aimed at preparing students for the demands of the job market.',
  "descriptionAr" = 'جامعة ميريت هي جامعة خاصة تأسست عام 2019 وتقع في مدينة سوهاج الجديدة، وتخدم طلاب صعيد مصر من خلال برامج أكاديمية في المجالات الطبية والعلمية والتكنولوجية. تضم الجامعة كليات الطب البشري، والعلاج الطبيعي، والصيدلة، والتكنولوجيا الحيوية، وتقدم برامجها باللغة الإنجليزية. وتركز الدراسة على الجمع بين الجانب الأكاديمي والتطبيق العملي، مع توفير معامل متخصصة وفرص للتدريب والبحث العلمي. كما تهتم الجامعة بالأنشطة الطلابية وتنمية المهارات، وتوفر بيئة تعليمية تهدف إلى إعداد الطلاب لمتطلبات سوق العمل.'
WHERE slug = 'merit-university';

UPDATE "University" SET description = 'The Arab Academy for Science, Technology and Maritime Transport is an educational institution affiliated with the League of Arab States. Founded in 1972, it offers study programs across a wide range of fields. Its specializations include engineering, computing and information technology, business administration, transport and logistics, and language and media, along with a number of medical and health programs and newer fields such as artificial intelligence. The Academy has branches in several Egyptian cities, including Alexandria, Cairo, El Alamein, Port Said and Aswan. Study combines academic education with practical application and training, with an emphasis on scientific research, innovation and international cooperation.',
  "descriptionAr" = 'الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري هي مؤسسة تعليمية تابعة لجامعة الدول العربية، تأسست عام 1972 وتقدم برامج دراسية في مجموعة واسعة من المجالات. تشمل تخصصاتها الهندسة، والحاسبات وتكنولوجيا المعلومات، وإدارة الأعمال، والنقل واللوجستيات، واللغة والإعلام، إلى جانب عدد من البرامج الطبية والصحية والتخصصات الحديثة مثل الذكاء الاصطناعي. وتنتشر فروع الأكاديمية في عدد من المدن المصرية، من بينها الإسكندرية والقاهرة والعلمين وبورسعيد وأسوان. وتركز الدراسة على الجمع بين التعليم الأكاديمي والتطبيق العملي والتدريب، مع الاهتمام بالبحث العلمي والابتكار والتعاون الدولي.'
WHERE slug = 'arab-academy-for-science-technology-and-maritime-transport';

UPDATE "University" SET description = 'October University for Modern Sciences and Arts (MSA) is a private university founded in 1996 in 6th of October City. It offers academic programs across a range of fields, including dentistry, pharmacy, biotechnology, engineering, computer science, management sciences, languages and translation, mass communication, arts and design, nutrition and food technology, and physical therapy. Study combines British academic standards with the requirements of university education in Egypt, with a focus on practical application and on developing research, analysis and problem-solving skills. The university also has academic partnerships with British universities and provides a learning environment with labs, training facilities and a variety of student activities.',
  "descriptionAr" = 'جامعة أكتوبر للعلوم الحديثة والآداب هي جامعة خاصة تأسست عام 1996 وتقع في مدينة 6 أكتوبر. تقدم الجامعة برامج أكاديمية في مجالات متنوعة تشمل طب الأسنان، والصيدلة، والتكنولوجيا الحيوية، والهندسة، وعلوم الحاسب، وعلوم الإدارة، واللغات والترجمة، والإعلام، والفنون والتصميم، والتغذية وتكنولوجيا الغذاء، والعلاج الطبيعي. وتعتمد الدراسة على الجمع بين المعايير الأكاديمية البريطانية ومتطلبات التعليم الجامعي في مصر، مع التركيز على التطبيق العملي وتنمية مهارات البحث والتحليل وحل المشكلات. كما ترتبط الجامعة بشراكات أكاديمية مع جامعات بريطانية، وتوفر بيئة تعليمية تضم معامل ومرافق تدريبية وأنشطة طلابية متنوعة.'
WHERE slug = 'msa-university';

UPDATE "University" SET description = 'The French University of Egypt is a national university founded in 2002 in El Shorouk City, offering an educational model that combines Egyptian and French education. Its programs cover engineering, artificial intelligence and data science, cybersecurity, information systems, business administration, economics, applied languages, architecture and more. Teaching is in English and French with support for Arabic, through academic partnerships with a number of French universities. Some of its programs also lead to accredited French degrees, along with opportunities for exchange and study in France, with a focus on practical application and scientific research.',
  "descriptionAr" = 'الجامعة الفرنسية في مصر هي جامعة أهلية تأسست عام 2002 وتقع في مدينة الشروق، وتقدم نموذجا تعليميا يجمع بين التعليم المصري والفرنسي. تضم الجامعة برامج في مجالات الهندسة، والذكاء الاصطناعي وعلوم البيانات، والأمن السيبراني، ونظم المعلومات، وإدارة الأعمال، والاقتصاد، واللغات التطبيقية، والعمارة وغيرها. وتقدم الدراسة باللغتين الإنجليزية والفرنسية مع دعم للغة العربية، من خلال شراكات أكاديمية مع عدد من الجامعات الفرنسية. كما تتيح بعض برامجها الحصول على درجات فرنسية معتمدة، إلى جانب فرص للتبادل والدراسة في فرنسا، مع التركيز على التطبيق العملي والبحث العلمي.'
WHERE slug = 'universite-francaise-degypte';

UPDATE "University" SET description = 'Badr University in Cairo is a private university founded in 2010 in Badr City, Cairo Governorate. It offers a wide variety of academic programs in fields including medicine, dentistry, pharmacy, engineering and technology, physical therapy, nursing, business administration, languages and translation, arts, humanities and more. Study follows the credit-hour system, with a focus on practical application, training and skills development. The campus offers labs, learning facilities and a range of student services, alongside sports, cultural and artistic activities. The university also provides fully equipped housing for female students with round-the-clock security and support, as well as transportation linking the university to a number of areas.',
  "descriptionAr" = 'جامعة بدر بالقاهرة هي جامعة خاصة تأسست عام 2010 وتقع في مدينة بدر بمحافظة القاهرة. تقدم الجامعة برامج أكاديمية متنوعة في مجالات تشمل الطب، وطب الفم والأسنان، والصيدلة، والهندسة والتكنولوجيا، والعلاج الطبيعي، والتمريض، وإدارة الأعمال، واللغات والترجمة، والفنون، والعلوم الإنسانية وغيرها. وتعتمد الدراسة على نظام الساعات المعتمدة، مع التركيز على التطبيق العملي والتدريب وتنمية المهارات. كما يوفر الحرم الجامعي معامل ومرافق تعليمية وخدمات طلابية متنوعة، إلى جانب أنشطة رياضية وثقافية وفنية. وتوفر الجامعة سكنا مجهزا للطالبات مع خدمات أمن ودعم على مدار الساعة، بالإضافة إلى وسائل نقل تربط الجامعة بعدد من المناطق.'
WHERE slug = 'badr-university-in-cairo';

UPDATE "University" SET description = 'Sphinx University is a private university established by presidential decree in 2019 in New Assiut City. It offers programs across a range of fields, including dentistry, pharmacy, physical therapy, veterinary medicine, engineering, computing and artificial intelligence, applied health sciences, and nursing. Study combines academic and applied curricula, with programs running from bachelor''s level through to postgraduate studies. The Faculty of Engineering includes specializations such as architecture, civil engineering, communications and electronics, and mechanical engineering, while health sciences include specializations such as medical laboratories, radiology, and emergency and critical care.',
  "descriptionAr" = 'جامعة سفنكس هي جامعة خاصة تأسست بقرار جمهوري عام 2019 وتقع في مدينة أسيوط الجديدة. تقدم الجامعة برامج دراسية في مجالات متنوعة تشمل طب الفم والأسنان، والصيدلة، والعلاج الطبيعي، والطب البيطري، والهندسة، والحاسبات والذكاء الاصطناعي، والعلوم الصحية التطبيقية، والتمريض. وتعتمد الدراسة على الجمع بين المناهج الأكاديمية والتطبيقية، مع برامج تمتد من مرحلة البكالوريوس إلى الدراسات العليا. وتضم كلية الهندسة تخصصات مثل الهندسة المعمارية والمدنية والاتصالات والإلكترونيات والهندسة الميكانيكية، بينما تشمل العلوم الصحية تخصصات مثل المختبرات الطبية والأشعة والطوارئ والرعاية الحرجة.'
WHERE slug = 'sphinx-university';

UPDATE "University" SET description = 'The British University in Egypt is a private university founded in 2005 in El Shorouk City, Cairo. It offers English-taught programs following British teaching methods, through academic partnerships with British universities. Its specializations span engineering, computer science, business administration, economics and political science, mass communication, law, pharmacy, dentistry, nursing, arts and design, and more. Study is built on continuous assessment and practical application, with modern labs, lecture halls and learning facilities. The university also provides student housing and transportation services, along with scholarships and discounts for high-achieving and outstanding students.',
  "descriptionAr" = 'الجامعة البريطانية في مصر هي جامعة خاصة تأسست عام 2005 وتقع في مدينة الشروق بالقاهرة، وتقدم برامج دراسية باللغة الإنجليزية وفق أساليب تعليمية بريطانية، من خلال شراكات أكاديمية مع جامعات بريطانية. تضم الجامعة تخصصات في مجالات الهندسة، وعلوم الحاسب، وإدارة الأعمال، والاقتصاد والعلوم السياسية، والإعلام، والقانون، والصيدلة، وطب الأسنان، والتمريض، والفنون والتصميم وغيرها. وتركز الدراسة على التقييم المستمر والتطبيق العملي، مع توفير معامل وقاعات وتجهيزات تعليمية حديثة. كما توفر الجامعة سكنا طلابيا وخدمات للنقل، إلى جانب فرص للمنح والخصومات للطلاب المتفوقين والمتميزين.'
WHERE slug = 'british-university-in-egypt';

UPDATE "University" SET description = 'Future University in Egypt is a private university founded in 2006 in the Fifth Settlement, New Cairo. It has six faculties: dentistry; pharmacy; engineering and technology; computers and information technology; commerce and business administration; and economics and political science. The university focuses on teaching, scientific research and practical application, with specialized labs and facilities, including a dental hospital and an industrial training plant for pharmacy. It also has academic partnerships with international universities, and offers students sports, cultural and artistic activities, along with student clubs and training and career services.',
  "descriptionAr" = 'جامعة المستقبل في مصر هي جامعة خاصة تأسست عام 2006 وتقع في التجمع الخامس بالقاهرة الجديدة. تضم الجامعة ست كليات في مجالات طب الفم والأسنان، والصيدلة، والهندسة والتكنولوجيا، والحاسبات وتكنولوجيا المعلومات، والتجارة وإدارة الأعمال، والاقتصاد والعلوم السياسية. وتركز الجامعة على التعليم والبحث العلمي والتطبيق العملي، مع توفير معامل ومرافق متخصصة، منها مستشفى طب الأسنان ومصنع للتدريب الصناعي في مجال الصيدلة. كما ترتبط الجامعة بشراكات أكاديمية مع جامعات دولية، وتوفر للطلاب أنشطة رياضية وثقافية وفنية، إلى جانب الأندية الطلابية وخدمات التدريب والتوظيف.'
WHERE slug = 'future-university-in-egypt';

UPDATE "University" SET description = 'Misr International University is a private university founded in 1996 on the Cairo-Ismailia Desert Road. Teaching began with two faculties, Al-Alsun and Mass Communication, and Business Administration, before expanding to include engineering, pharmacy, computer science and dentistry, along with departments of architecture and of electronics and communications. The university focuses on integrating its academic programs with applied scientific research and student skills development, with an emphasis on innovation, entrepreneurship and professional development. It also has academic cooperation with international universities and institutions, and offers students a range of educational and community activities and services.',
  "descriptionAr" = 'جامعة مصر الدولية هي جامعة خاصة تأسست عام 1996 وتقع على طريق القاهرة – الإسماعيلية الصحراوي. بدأت الدراسة بكليتي الألسن والإعلام وإدارة الأعمال، ثم توسعت لتشمل الهندسة، والصيدلة، وعلوم الحاسب، وطب الفم والأسنان، إلى جانب أقسام الهندسة المعمارية والإلكترونيات والاتصالات. وتركز الجامعة على دمج البرامج التعليمية مع البحث العلمي التطبيقي وتنمية مهارات الطلاب، مع اهتمام بالابتكار وريادة الأعمال والتطوير المهني. كما ترتبط الجامعة بتعاون أكاديمي مع جامعات ومؤسسات دولية، وتوفر للطلاب أنشطة وخدمات تعليمية ومجتمعية متنوعة.'
WHERE slug = 'misr-international-university-miu';

UPDATE "University" SET description = 'Misr University for Science and Technology is a private university founded in 1996 in 6th of October City. It stands out for its fully integrated campus, which includes Souad Kafafi University Hospital, giving students in medical fields opportunities for hands-on training, as well as a central library, a testing center, sports facilities and an opera house. The university also provides transportation for students, and separate university housing for male and female students about 5 minutes from campus, with furnished rooms and apartments, supervision and round-the-clock medical services. The university also invests in student life through clubs, activities and a variety of events.',
  "descriptionAr" = 'جامعة مصر للعلوم والتكنولوجيا هي جامعة خاصة تأسست عام 1996 وتقع في مدينة السادس من أكتوبر. تتميز بتوفير بيئة جامعية متكاملة تضم مستشفى سعاد كفافي الجامعي، الذي يتيح لطلاب التخصصات الطبية فرصا للتدريب العملي، إلى جانب مكتبة مركزية ومركز اختبارات ومرافق رياضية ودار أوبرا. كما توفر الجامعة وسائل نقل للطلاب، وسكنا جامعيا منفصلا للطلاب والطالبات يبعد نحو 5 دقائق عن الحرم، مع غرف وشقق مفروشة وإشراف وخدمات طبية على مدار الساعة. وتهتم الجامعة بالحياة الطلابية من خلال الأندية والأنشطة والفعاليات المختلفة.'
WHERE slug = 'misr-university-for-science-and-technology';

UPDATE "University" SET description = 'Nile University is a non-profit national university founded in 2006, and one of the universities with a particular focus on scientific research, innovation and entrepreneurship. The university relies on applied learning through real projects and hands-on training in collaboration with more than 200 industry partners. It also has specialized research centers in technology, engineering and computer science, along with a system that supports students in developing ideas and turning them into projects and startups. The university also offers full and partial scholarships based on academic excellence and merit.',
  "descriptionAr" = 'جامعة النيل هي جامعة أهلية غير هادفة للربح تأسست عام 2006، وتعد من الجامعات التي تركز بشكل خاص على البحث العلمي والابتكار وريادة الأعمال. تعتمد الجامعة على التعلم التطبيقي من خلال مشروعات حقيقية وتدريب عملي بالتعاون مع أكثر من 200 شريك من قطاع الصناعة. كما توفر مراكز بحثية متخصصة في مجالات التكنولوجيا والهندسة وعلوم الحاسب، إلى جانب منظومة لدعم الطلاب في تطوير الأفكار وتحويلها إلى مشروعات وشركات ناشئة. وتقدم الجامعة أيضا منحا دراسية كاملة وجزئية للطلاب وفقا لمعايير التفوق والاستحقاق.'
WHERE slug = 'nile-university';

UPDATE "University" SET description = 'October 6 University is Egypt''s first private university, founded in 1996 in 6th of October City. It stands out for its fully integrated campus, which includes a 320-bed teaching and treatment hospital, along with a central library and a range of student centers and services. The university provides student housing for men and women: women''s housing is on campus and men''s housing is near the university, with single and double rooms and living and internet services. It also runs transportation covering different parts of Greater Cairo, as well as sports fields and many student activities.',
  "descriptionAr" = 'جامعة 6 أكتوبر هي أول جامعة خاصة في مصر، تأسست عام 1996 وتقع في مدينة 6 أكتوبر. تتميز بحرم جامعي متكامل يضم مستشفى تعليمي وعلاجي بسعة 320 سريرا، إلى جانب مكتبة مركزية ومراكز وخدمات طلابية متنوعة. كما توفر الجامعة سكنًا طلابيًا للطلاب والطالبات، حيث يقع سكن الطالبات داخل الحرم الجامعي وسكن الطلاب بالقرب من الجامعة، مع غرف فردية ومزدوجة وخدمات للمعيشة والإنترنت. وتوفر الجامعة أيضا خدمات نقل تغطي مناطق مختلفة من القاهرة الكبرى، بالإضافة إلى ملاعب رياضية وأنشطة طلابية متعددة.'
WHERE slug = 'october-6-university';

UPDATE "University" SET description = 'Ahram Canadian University is a private university founded in 2005 in 6th of October City, offering students a university environment that combines academic study with practical application. The university has specialized labs and facilities that help students gain practical experience alongside their studies, with an emphasis on training and developing the skills the job market needs. It also offers a varied university life through student, sports and cultural activities, along with services that help students develop their skills and build experience outside the classroom. The university is affiliated with Al-Ahram Establishment, providing a learning environment that brings together study, training and connections with a range of professional fields.',
  "descriptionAr" = 'جامعة الأهرام الكندية هي جامعة خاصة تأسست عام 2005 في مدينة 6 أكتوبر، وتوفر للطلاب بيئة جامعية تجمع بين الدراسة الأكاديمية والتطبيق العملي. تتميز الجامعة بوجود معامل ومرافق متخصصة تساعد الطلاب على اكتساب الخبرة العملية إلى جانب الدراسة، مع الاهتمام بالتدريب وتنمية المهارات المطلوبة لسوق العمل. كما توفر حياة جامعية متنوعة من خلال الأنشطة الطلابية والرياضية والثقافية، إلى جانب خدمات تساعد الطلاب على تطوير مهاراتهم وبناء خبراتهم خارج قاعات الدراسة. وترتبط الجامعة بمؤسسة الأهرام، بما يوفر بيئة تعليمية تجمع بين الدراسة والتدريب والتواصل مع مجالات مهنية متنوعة.'
WHERE slug = 'ahram-canadian-university';

UPDATE "University" SET description = 'Al Hayah University is a private university established by presidential decree in 2019 in the universities district of the Fifth Settlement. Its campus covers 32 feddans (about 33 acres) and houses learning facilities and equipped labs, including specialized physical therapy labs and modern information technology labs. The university focuses on education that combines study with practical application, with an emphasis on scientific research and cooperation with foreign universities. It also aims to produce graduates with the skills to compete in the job market in Egypt and abroad, and provides a modern university environment in the New Cairo universities district.',
  "descriptionAr" = 'جامعة الحياة هي جامعة خاصة تأسست بقرار جمهوري عام 2019 وتقع في منطقة الجامعات بالتجمع الخامس. تمتد على مساحة 32 فدانا وتضم مرافق تعليمية ومعامل مجهزة، من بينها معامل متخصصة للعلاج الطبيعي ومعامل حديثة لتكنولوجيا المعلومات. وتركز الجامعة على تقديم تعليم يجمع بين الدراسة والتطبيق العملي، مع اهتمام بالبحث العلمي والتعاون مع جامعات أجنبية. كما تسعى إلى إعداد خريجين يمتلكون المهارات التي تساعدهم على المنافسة في سوق العمل داخل مصر وخارجها، وتوفر بيئة جامعية حديثة في منطقة الجامعات بالقاهرة الجديدة.'
WHERE slug = 'al-hayah-university-in-cairo';

UPDATE "University" SET description = 'Al Salam University in Egypt is a private university in the heart of the Delta, in Gharbia Governorate, founded in 2018. The university focuses on combining academic excellence with practical application, providing a modern learning environment that supports students and prepares them for the job market. It offers a variety of scholarships for high achievers, including scholarships for top Thanaweya Amma students as well as academic and sports excellence scholarships. The university also provides student transportation and fully serviced hotel-style housing. Campus life includes a variety of activities and sports facilities, with opportunities to take part in competitions and student events.',
  "descriptionAr" = 'جامعة السلام بمصر هي جامعة خاصة تقع في قلب منطقة الدلتا بمحافظة الغربية، وتأسست عام 2018. تركز الجامعة على الجمع بين التميز الأكاديمي والتطبيق العملي، مع توفير بيئة تعليمية حديثة لدعم الطلاب وتأهيلهم لسوق العمل. وتتميز بتقديم منح دراسية متنوعة للمتفوقين، تشمل منحا لاوائل الثانوية العامة، إلى جانب منح التفوق الدراسي والرياضي. كما توفر الجامعة خدمة الانتقالات للطلاب، بالإضافة إلى سكن فندقي متكامل الخدمات. وتضم الحياة الجامعية أنشطة ومرافق رياضية متنوعة، مع فرص للمشاركة في المسابقات والفعاليات الطلابية.'
WHERE slug = 'al-salam-university';

UPDATE "University" SET description = 'Badya University offers a modern university experience focused on hands-on learning and student skills development, with advanced labs and equipment and learning spaces designed to support study and practice. The university also works to connect students with the job market through training opportunities and cooperation with companies, alongside a varied campus life that includes clubs and sports, artistic and social activities. It also provides services for students'' convenience, including transportation, making the study experience more complete.',
  "descriptionAr" = 'تتميز جامعة باديا بتقديم تجربة جامعية حديثة تركز على التعلم العملي وتنمية مهارات الطلاب، مع توفير معامل وتجهيزات متطورة ومساحات تعليمية مصممة لدعم الدراسة والتطبيق. كما تهتم الجامعة بربط الطلاب بسوق العمل من خلال فرص التدريب والتعاون مع الشركات، إلى جانب حياة جامعية متنوعة تشمل الأندية والأنشطة الرياضية والفنية والاجتماعية. وتوفر الجامعة كذلك خدمات تساعد على راحة الطلاب، من بينها خدمة الانتقالات، مما يجعل تجربة الدراسة أكثر تكاملا.'
WHERE slug = 'badya-university';

UPDATE "University" SET description = 'Canadian International College (CIC) offers education that combines academic study with practical application, with a partnership with Canada''s Cape Breton University that allows students to earn an accredited Canadian bachelor''s degree alongside the Egyptian degree in eligible programs. The college focuses on hands-on training and projects linked to the job market, with smart classrooms and modern labs on its New Cairo and Sheikh Zayed campuses. It also offers opportunities to study or go on exchange in Canada, along with a variety of student activities and clubs, including the Student Union, AIESEC and Hult Prize, giving students a university experience that brings together study, training and student life.',
  "descriptionAr" = 'تتميز الكلية الكندية الدولية (CIC) بتقديم تعليم يجمع بين الدراسة الأكاديمية والتطبيق العملي، مع شراكة مع جامعة كيب بريتون الكندية تتيح للطلاب الحصول على درجة بكالوريوس كندية معتمدة إلى جانب الدرجة المصرية في البرامج المتاحة. وتركز الكلية على التدريب العملي والمشروعات المرتبطة بسوق العمل، مع فصول ذكية ومعامل حديثة في حرمي القاهرة الجديدة والشيخ زايد. كما توفر فرصا للدراسة أو التبادل في كندا، إلى جانب أنشطة وأندية طلابية متنوعة تشمل اتحاد الطلاب وAIESEC وHult Prize، مما يمنح الطلاب تجربة جامعية تجمع بين الدراسة والتدريب والحياة الطلابية.'
WHERE slug = 'canadian-international-college';

UPDATE "University" SET description = 'City University in Cairo offers applied programs that aim to equip students with skills that match the needs of the job market, with an emphasis on scientific research and practical projects. The university is located in New Heliopolis City in Badr City, near the New Administrative Capital, and has research units in fields such as engineering and technology, medical sciences and biotechnology. It also offers scholarships for high-achieving students, and emphasizes training, cooperative education and linking study to the needs of different sectors. University life also offers activities and events that help students develop their skills and experience beyond their studies.',
  "descriptionAr" = 'تتميز جامعة المدينة بالقاهرة بتقديم برامج تعليمية تطبيقية تهدف إلى إعداد الطلاب بمهارات تتوافق مع احتياجات سوق العمل، مع الاهتمام بالبحث العلمي والمشروعات العملية. وتقع الجامعة في مدينة هليوبوليس الجديدة بمدينة بدر، بالقرب من العاصمة الإدارية الجديدة، وتضم وحدات بحثية في مجالات متنوعة مثل الهندسة والتكنولوجيا والعلوم الطبية والتكنولوجيا الحيوية. كما توفر الجامعة منحا دراسية للطلاب المتفوقين، وتهتم بالتدريب والتعليم التعاوني وربط الدراسة باحتياجات قطاعات العمل المختلفة. وتوفر الحياة الجامعية كذلك أنشطة وفعاليات تساعد الطلاب على تطوير مهاراتهم وتجاربهم خارج الدراسة.'
WHERE slug = 'city-university';

UPDATE "University" SET description = 'Coventry University Egypt offers a British education through its branch in the New Administrative Capital, with programs delivered under the supervision of the parent university in the UK and to the same academic standards. Study focuses on practical application and linking education to the needs of the job market, with notable specializations in computing, engineering, design, media and business administration. Its computing programs have specialized labs that include virtual reality technologies and cybersecurity systems, and students also have opportunities to benefit from Coventry University''s academic and research environment.',
  "descriptionAr" = 'جامعة كوفنتري في مصر تقدم تجربة تعليم بريطانية من خلال فرعها في العاصمة الإدارية الجديدة، مع برامج دراسية تُقدم تحت إشراف الجامعة الأم في بريطانيا وبنفس معاييرها الأكاديمية. تركز الدراسة على التطبيق العملي وربط التعليم باحتياجات سوق العمل، مع تخصصات مميزة في الحاسبات والهندسة والتصميم والإعلام وإدارة الأعمال. كما توفر برامج الحاسبات معامل متخصصة تشمل تقنيات الواقع الافتراضي وأنظمة الأمن السيبراني، إلى جانب فرص للطلاب للاستفادة من البيئة الأكاديمية والبحثية لجامعة كوفنتري.'
WHERE slug = 'coventry-university-egypt';

UPDATE "University" SET description = 'Deraya University in New Minya City offers a learning experience that combines academic study with practical application, with a focus on preparing students for the job market and developing their professional skills. The university provides labs, clinics and specialized facilities that help students apply what they learn, especially in medical and engineering fields. It also invests in campus life through sports, cultural and social activities, along with training opportunities and cooperation with various institutions and organizations. The university also offers student services including transportation, medical care and recreational facilities, for a well-rounded university experience.',
  "descriptionAr" = 'تتميز جامعة دراية بمدينة المنيا الجديدة بتقديم تجربة تعليمية تجمع بين الدراسة الأكاديمية والتطبيق العملي، مع التركيز على إعداد الطلاب لسوق العمل وتنمية مهاراتهم المهنية. وتوفر الجامعة معامل وعيادات ومرافق متخصصة تساعد الطلاب على تطبيق ما يتعلمونه، خاصة في المجالات الطبية والهندسية. كما تهتم بالحياة الجامعية من خلال الأنشطة الرياضية والثقافية والاجتماعية، إلى جانب فرص التدريب والتعاون مع مؤسسات وجهات مختلفة. وتوفر الجامعة كذلك خدمات للطلاب تشمل النقل والرعاية الطبية والمرافق الترفيهية، لتقديم تجربة جامعية متكاملة.'
WHERE slug = 'deraya-university';

UPDATE "University" SET description = 'The Egypt-Japan University of Science and Technology (E-JUST) offers a distinctive experience based on the Japanese approach to education, with a focus on projects, practical application, research and innovation. The campus has specialized labs and modern equipment that help students turn knowledge into real applications and projects. The university also provides on-campus student housing, along with sports fields and facilities and student activities and clubs. Its environment also offers opportunities for academic cooperation and exchange with Japanese and international universities and institutions, giving students a learning experience that goes beyond the lecture hall.',
  "descriptionAr" = 'الجامعة المصرية اليابانية للعلوم والتكنولوجيا (E-JUST) تقدم تجربة مختلفة تعتمد على أسلوب التعليم الياباني، مع التركيز على المشروعات والتطبيق العملي والبحث والابتكار. ويضم الحرم الجامعي معامل متخصصة وتجهيزات حديثة تساعد الطلاب على تحويل المعرفة إلى تطبيقات ومشروعات فعلية. كما توفر الجامعة سكنا طلابيا داخل الحرم، إلى جانب ملاعب ومرافق رياضية متنوعة وأنشطة وأندية طلابية. وتتيح بيئة الجامعة أيضا فرصا للتعاون والتبادل الأكاديمي مع جامعات ومؤسسات يابانية ودولية، مما يمنح الطلاب تجربة تعليمية تتجاوز الدراسة داخل المحاضرات.'
WHERE slug = 'egypt-japan-university-of-science-and-technology';

UPDATE "University" SET description = 'Egypt University of Informatics (EUI) offers a university experience specialized in technology and communications, on a modern campus in Knowledge City in the New Administrative Capital. Study focuses on practical application and innovation, with more than 100 internship opportunities with companies and organizations in the ICT sector. Qualified students can earn dual degrees in partnership with international universities, and outstanding students can receive full and partial scholarships. The university offers an active student life with more than 16 clubs and events, as well as furnished university housing and career services that help students prepare for the job market.',
  "descriptionAr" = 'جامعة مصر للمعلوماتية (EUI) تقدم تجربة جامعية متخصصة في مجالات التكنولوجيا والاتصالات، داخل حرم حديث في مدينة المعرفة بالعاصمة الإدارية الجديدة. وتركز الدراسة على التطبيق العملي والابتكار، مع أكثر من 100 فرصة تدريب مع شركات ومؤسسات من قطاع تكنولوجيا المعلومات والاتصالات. كما تتيح للطلاب المؤهلين فرص الحصول على شهادات مزدوجة بالتعاون مع جامعات دولية، إلى جانب منح دراسية كاملة وجزئية للطلاب المتميزين. وتوفر الجامعة حياة طلابية نشطة من خلال أكثر من 16 ناديا وفعالية، بالإضافة إلى سكن جامعي مفروش وخدمات مهنية تساعد الطلاب على الاستعداد لسوق العمل.'
WHERE slug = 'egyptian-informatics-university';

UPDATE "University" SET description = 'Galala University is a non-profit national university in Galala City, offering a modern university experience that combines applied education with research and innovation. It offers more than 60 programs across a range of specializations, with advanced labs and facilities that help students study, carry out projects and get hands-on training. It also stands out for its partnership with Arizona State University, which offers dual-degree programs in a number of specializations. The campus includes student housing and a variety of sports and recreational facilities, along with student clubs and activities, for a complete on-campus university experience, with transportation linking the university to Cairo and Giza.',
  "descriptionAr" = 'جامعة الجلالة هي جامعة أهلية غير هادفة للربح تقع في مدينة الجلالة، وتقدم تجربة جامعية حديثة تجمع بين التعليم التطبيقي والبحث والابتكار. تضم الجامعة أكثر من 60 برنامجا في تخصصات متنوعة، مع معامل ومرافق متطورة تساعد الطلاب على الدراسة وتنفيذ المشروعات والتدريب العملي. كما تتميز بشراكتها مع "Arizona State University" التي تتيح برامج درجات مزدوجة في عدد من التخصصات. ويضم الحرم الجامعي سكنا للطلاب ومرافق رياضية وترفيهية متنوعة، إلى جانب الأندية والأنشطة الطلابية، لتوفير تجربة جامعية متكاملة داخل الحرم، مع خدمات نقل تربط الجامعة بالقاهرة والجيزة.'
WHERE slug = 'galala-university';

UPDATE "University" SET description = 'Heliopolis University for Sustainable Development offers a distinctive learning experience focused on sustainable development and hands-on learning, combining teaching, scientific research and practical application. The campus has extensive green spaces and a variety of sports facilities, along with university housing, a medical center and a botanical garden. The university also offers the Core Program, which focuses on the humanities, languages and arts and on developing creativity and social responsibility. It gives students the chance to apply what they learn through projects and practical experiences linked to community needs, in a campus environment that cares about sustainability and protecting the environment.',
  "descriptionAr" = 'جامعة هليوبوليس للتنمية المستدامة تتميز بتجربة تعليمية مختلفة تركز على التنمية المستدامة والتعلم العملي، حيث تجمع الدراسة بين التعليم والبحث العلمي والتطبيق. ويضم الحرم الجامعي مساحات خضراء واسعة ومرافق رياضية متنوعة، إلى جانب السكن الجامعي والمركز الطبي والحديقة النباتية. كما تقدم الجامعة البرنامج الأساسي (Core Program) الذي يهتم بالعلوم الإنسانية واللغات والفنون وتنمية الإبداع والمسؤولية الاجتماعية. وتمنح الجامعة الطلاب فرصة لتطبيق ما يتعلمونه من خلال مشروعات وتجارب عملية مرتبطة باحتياجات المجتمع، مع بيئة جامعية تهتم بالاستدامة والحفاظ على البيئة.'
WHERE slug = 'heliopolis-university-for-sustainable-development';

UPDATE "University" SET description = 'Horus University in New Damietta combines study with practical application in a modern campus environment, offering a varied learning experience across medical, engineering, technology and management specializations. The university prepares students for the job market through labs and hands-on training, with particular attention to newer specializations such as artificial intelligence and informatics. It also provides digital services that make it easy for students to follow their registration, schedules, grades and course materials. Campus life includes a variety of activities and services, giving students an experience that brings together study, training and life on campus.',
  "descriptionAr" = 'جامعة تجمع بين الدراسة والتطبيق العملي في بيئة جامعية حديثة، فجامعة حورس في دمياط الجديدة توفر تجربة تعليمية متنوعة تضم تخصصات طبية وهندسية وتكنولوجية وإدارية. وتهتم الجامعة بتجهيز الطلاب لسوق العمل من خلال المعامل والتدريب العملي، مع اهتمام خاص بالتخصصات الحديثة مثل الذكاء الاصطناعي والمعلوماتية. كما توفر خدمات رقمية تساعد الطلاب في متابعة التسجيل والجداول والدرجات والمواد الدراسية بسهولة. وتضم الحياة الجامعية أنشطة وخدمات متنوعة، لتوفر للطلاب تجربة تجمع بين الدراسة والتدريب والحياة داخل الحرم الجامعي.'
WHERE slug = 'horus-university-in-egypt';

UPDATE "University" SET description = 'Innovation University is a private non-profit university in 10th of Ramadan City, offering a modern learning experience focused on innovation, practical application and entrepreneurship. It stands out for programs in technology, engineering, medical sciences, business administration, and arts and design, with a clear emphasis on linking study to the needs of the job market and cooperating with companies. The university also provides training opportunities and practical projects, and invests in scientific research, artificial intelligence and innovation. It also offers a range of scholarships and incentives for students who excel academically and in sports, and has a prime location opposite the electric train station and the bus station in 10th of Ramadan City.',
  "descriptionAr" = 'جامعة الابتكار هي جامعة خاصة غير هادفة للربح تقع في مدينة العاشر من رمضان، وتقدم تجربة تعليمية حديثة تركز على الابتكار والتطبيق العملي وريادة الأعمال. وتتميز ببرامج في مجالات التكنولوجيا والهندسة والعلوم الطبية وإدارة الأعمال والفنون والتصميم، مع اهتمام واضح بربط الدراسة باحتياجات سوق العمل والتعاون مع الشركات. كما توفر الجامعة فرصا للتدريب والمشروعات العملية، وتهتم بالبحث العلمي والذكاء الاصطناعي والابتكار. وتقدم أيضا مجموعة من المنح والحوافز للطلاب المتفوقين أكاديميا ورياضيا، مع موقع مميز أمام محطة القطار الكهربائي ومحطة الحافلات بمدينة العاشر من رمضان.'
WHERE slug = 'innovation-university';

UPDATE "University" SET description = 'King Salman International University is a non-profit national university offering a distinctive university experience in South Sinai through three branches in El Tor, Sharm El Sheikh and Ras Sedr. It stands out for its smart campus, with modern labs and classrooms that support hands-on learning and new specializations, and a focus on innovation and scientific research. Among its highlights is hotel-style housing on campus, along with restaurants, student services, sports facilities and swimming pools. The university also offers a varied student life through sports, cultural and recreational activities, making study a complete experience that combines education and campus life in a unique setting in South Sinai.',
  "descriptionAr" = 'جامعة الملك سلمان الدولية هي جامعة أهلية غير هادفة للربح تقدم تجربة جامعية مختلفة في جنوب سيناء من خلال ثلاثة أفرع في الطور وشرم الشيخ ورأس سدر. وتتميز بحرم جامعي ذكي يضم معامل وفصولا حديثة تدعم التعلم العملي والتخصصات الحديثة، مع التركيز على الابتكار والبحث العلمي. ومن أبرز مميزاتها السكن الفندقي داخل الحرم، إلى جانب المطاعم والخدمات الطلابية والمرافق الرياضية وحمامات السباحة. كما توفر الجامعة حياة طلابية متنوعة من خلال الأنشطة الرياضية والثقافية والترفيهية، مما يجعل الدراسة تجربة متكاملة تجمع بين التعليم والحياة الجامعية في بيئة مميزة بجنوب سيناء.'
WHERE slug = 'king-salman-international-university';

UPDATE "University" SET description = 'Lotus University in Minya is a private university in New Minya City, offering a modern university experience focused on innovation, hands-on learning and preparing students for the job market. The university offers a variety of specializations, with modern labs and equipment and opportunities for research and practical application. Its campus includes student housing, green spaces, sports fields and restaurants, along with sports, cultural and social activities that help students build relationships and develop their skills beyond their studies. The university uses the credit-hour system, in a learning environment that values innovation, social responsibility and serving the community of Upper Egypt.',
  "descriptionAr" = 'جامعة اللوتس بالمنيا هي جامعة خاصة تقع في مدينة المنيا الجديدة، وتقدم تجربة جامعية حديثة تركز على الابتكار والتعلم العملي وتأهيل الطلاب لسوق العمل. وتوفر الجامعة مجموعة متنوعة من التخصصات، مع معامل وتجهيزات حديثة وفرص للبحث والتطبيق العملي. كما تتميز بحرم جامعي يضم سكنًا للطلاب، ومساحات خضراء، وملاعب، ومطاعم، إلى جانب أنشطة رياضية وثقافية واجتماعية تساعد الطلاب على تكوين علاقات وتطوير مهاراتهم خارج الدراسة. وتستخدم الجامعة نظام الساعات المعتمدة، مع بيئة تعليمية تهتم بالابتكار والمسؤولية الاجتماعية وخدمة مجتمع صعيد مصر.'
WHERE slug = 'lotus-university';

UPDATE "University" SET description = 'Modern University for Technology and Information (MTI) is a private university in Mokattam, offering a learning environment that combines academic study with practical application. The university has a 175-bed teaching university hospital, along with 22 outpatient clinics, labs, a radiology department, operating rooms and an intensive care unit, giving medical students the chance to train in a fully integrated medical setting. It also has specialized technology and training labs and centers, and offers courses in areas such as artificial intelligence, programming and information technology. MTI also invests in student life through scientific, cultural, artistic and sports activities and training opportunities linked to the job market.',
  "descriptionAr" = 'الجامعة الحديثة للتكنولوجيا والمعلومات (MTI) هي جامعة خاصة في المقطم، وتتميز بتوفير بيئة تعليمية تجمع بين الدراسة الأكاديمية والتطبيق العملي. وتضم الجامعة مستشفى جامعي تعليمي بسعة 175 سريرا، إلى جانب 22 عيادة خارجية ومعامل وقسم أشعة وغرف عمليات ووحدة عناية مركزة، مما يوفر لطلاب الطب فرصة للتدريب العملي داخل بيئة طبية متكاملة. كما تضم الجامعة معامل ومراكز متخصصة في التكنولوجيا والتدريب، وتوفر دورات في مجالات مثل الذكاء الاصطناعي والبرمجة وتكنولوجيا المعلومات. وتهتم MTI كذلك بالحياة الطلابية من خلال الأنشطة العلمية والثقافية والفنية والرياضية وفرص التدريب المرتبطة بسوق العمل.'
WHERE slug = 'modern-university-for-technology-and-information';

UPDATE "University" SET description = 'Nahda University is the first private university in Upper Egypt, located in New Beni Suef City on the Cairo-Beni Suef road. It offers a university experience that combines academic study with practical application, with a variety of specializations in medical, engineering, technology, management and arts fields. Among its highlights is Nahda University Hospital, which provides a training environment for medical students, along with labs, learning equipment and a center for scientific and applied research. The university also provides equipped, air-conditioned student housing with restaurants, a cafeteria, and security and cleaning services, as well as sports fields, sports, cultural and artistic activities, and transportation linking the university to Cairo and several surrounding governorates and cities.',
  "descriptionAr" = 'جامعة النهضة هي أول جامعة خاصة في صعيد مصر، وتقع في مدينة بني سويف الجديدة على طريق القاهرة–بني سويف. وتقدم تجربة جامعية تجمع بين الدراسة الأكاديمية والتطبيق العملي، مع تخصصات متنوعة في المجالات الطبية والهندسية والتكنولوجية والإدارية والفنية. ومن أبرز مميزاتها مستشفى جامعة النهضة التي توفر بيئة تدريبية لطلاب القطاع الطبي، إلى جانب معامل وتجهيزات تعليمية ومركز للأبحاث العلمية والتطبيقية. كما توفر الجامعة سكنًا طلابيًا مجهزًا ومكيفًا مع مطاعم وكافيتريا وخدمات أمن ونظافة، بالإضافة إلى ملاعب وأنشطة رياضية وثقافية وفنية وخدمات انتقال تربط الجامعة بالقاهرة وعدد من المحافظات والمدن المحيطة.'
WHERE slug = 'nahda-university';

UPDATE "University" SET description = 'New Alamein International University is a non-profit national university in New Alamein City, offering a modern university experience based on interdisciplinary education, project-based learning and practical application. It benefits from its location in New Alamein City, with a modern campus that includes advanced labs and learning and sports facilities, as well as on-campus student housing. The university also offers a variety of student activities and opportunities for training and cooperation with different institutions and companies, with a clear emphasis on innovation and scientific research. The nature of the campus and the city gives students the chance to enjoy a modern university environment that brings together study and student life.',
  "descriptionAr" = 'جامعة العلمين الدولية هي جامعة أهلية غير هادفة للربح تقع في مدينة العلمين الجديدة، وتقدم تجربة جامعية حديثة تعتمد على التعليم متعدد التخصصات والتعلم القائم على المشروعات والتطبيق العملي. وتتميز بموقعها داخل مدينة العلمين الجديدة، مع حرم جامعي حديث يضم معامل ومرافق تعليمية ورياضية متطورة، بالإضافة إلى سكن طلابي داخل الحرم. كما توفر الجامعة أنشطة طلابية متنوعة وفرصا للتدريب والتعاون مع مؤسسات وشركات مختلفة، مع اهتمام واضح بالابتكار والبحث العلمي. وتمنح طبيعة الحرم والمدينة الطلاب فرصة للاستفادة من بيئة جامعية حديثة تجمع بين الدراسة والحياة الطلابية.'
WHERE slug = 'new-alamein-international-university';

UPDATE "University" SET description = 'New Mansoura University is a non-profit national university in New Mansoura City, offering a modern learning experience based on project-based learning and practical application, with programs in a variety of fields suited to the needs of the job market. The campus has a modern design and includes specialized labs, a university hospital, and advanced learning and sports facilities. The university also provides on-campus student housing, along with restaurants, student services, sports fields and activity areas. It values innovation, scientific research and training, providing a campus environment that helps students combine study and student life in one place.',
  "descriptionAr" = 'جامعة المنصورة الجديدة هي جامعة أهلية غير هادفة للربح، تقع في مدينة المنصورة الجديدة، وتقدم تجربة تعليمية حديثة تعتمد على التعلم القائم على المشروعات والتطبيق العملي، مع برامج في مجالات متنوعة تلائم احتياجات سوق العمل. يتميز الحرم الجامعي بتصميم حديث ويضم معامل متخصصة، مستشفى جامعي، ومرافق تعليمية ورياضية متطورة. كما توفر الجامعة سكنًا طلابيًا داخل الحرم، إلى جانب مطاعم وخدمات طلابية وملاعب ومناطق للأنشطة. وتهتم الجامعة بالابتكار والبحث العلمي والتدريب، مع توفير بيئة جامعية تساعد الطلاب على الجمع بين الدراسة والحياة الطلابية في مكان واحد.'
WHERE slug = 'new-mansoura-university';

UPDATE "University" SET description = 'Nile Valley University is a new private university in Fayoum Governorate, offering a learning experience focused on preparing students for the job market through modern curricula and labs equipped with advanced teaching and research methods. The university focuses on medical and technology fields, with specializations such as dentistry, pharmacy, applied health sciences and nursing, as well as physical therapy and artificial intelligence. It also offers services that make university life easier, including transportation, on-campus internet and dedicated parking. The university also values scientific research, innovation and community partnerships, and is working towards becoming a smart campus.',
  "descriptionAr" = 'جامعة وادي النيل هي جامعة خاصة حديثة في محافظة الفيوم، وتقدم تجربة تعليمية تركز على إعداد الطلاب لسوق العمل من خلال مناهج حديثة ومعامل مجهزة بأساليب تدريس وبحث متطورة. وتتميز الجامعة بتركيزها على المجالات الطبية والتكنولوجية، مع تخصصات مثل طب الأسنان والصيدلة والعلوم الصحية التطبيقية والتمريض، إلى جانب العلاج الطبيعي والذكاء الاصطناعي. كما توفر للطلاب خدمات تساعد على سهولة الحياة الجامعية، منها خدمة النقل، الإنترنت داخل الحرم ومواقف مخصصة للسيارات. وتهتم الجامعة كذلك بالبحث العلمي والابتكار والشراكات المجتمعية، مع توجه لتحويل الحرم إلى جامعة ذكية.'
WHERE slug = 'nile-valley-university';

UPDATE "University" SET description = 'Obour University of Science and Technology (OUST) is a new university on the Cairo-Belbeis Desert Road, focused on practical education linked to the needs of the job market. It currently has faculties of pharmacy, engineering and technology, computing and artificial intelligence, and business administration and entrepreneurship, with programs aimed at modern, in-demand fields. The university emphasizes hands-on training through workshops and training programs with companies and institutions, and supports scientific research by establishing specialized research centers. It is also developing its digital services and an online student portal, with a clear focus on campus life and engaging with students.',
  "descriptionAr" = 'جامعة العبور للعلوم والتكنولوجيا (OUST) هي جامعة حديثة تقع على طريق القاهرة–بلبيس الصحراوي، وتركز على تقديم تعليم عملي يرتبط باحتياجات سوق العمل. وتضم حاليا كليات الصيدلة والهندسة والتكنولوجيا والحاسبات والذكاء الاصطناعي وإدارة الأعمال وريادة الأعمال، مع برامج تستهدف المجالات الحديثة والتخصصات المطلوبة. وتهتم الجامعة بالتدريب العملي من خلال ورش وبرامج تدريبية بالتعاون مع الشركات والمؤسسات، إلى جانب دعم البحث العلمي وإنشاء مراكز بحثية متخصصة. كما تعمل الجامعة على تطوير خدماتها الرقمية وتوفير بوابة إلكترونية للطلاب، مع اهتمام واضح بالحياة الجامعية والتفاعل مع الطلاب.'
WHERE slug = 'obour-university-of-science-and-technology';

UPDATE "University" SET description = 'Pharos University in Alexandria is a private university in Alexandria, offering a learning experience that combines academic study with practical application, with a clear emphasis on training and preparing students for the job market. Among its highlights is Pharos University Hospital, which provides a training environment for students in medical fields, along with specialized clinics and labs. The university also has a training and consultancy center, sports and recreational facilities, and a variety of student activities that help students develop their skills beyond their studies. It also provides transportation and housing for students, making the study experience more complete.',
  "descriptionAr" = 'جامعة فاروس بالإسكندرية هي جامعة خاصة تقع في الإسكندرية، وتقدم تجربة تعليمية تجمع بين الدراسة الأكاديمية والتطبيق العملي، مع اهتمام واضح بالتدريب وتأهيل الطلاب لسوق العمل. ومن أبرز مميزاتها مستشفى فاروس الجامعي الذي يوفر بيئة تدريبية لطلاب التخصصات الطبية، إلى جانب عيادات ومعامل متخصصة. كما تضم الجامعة مركزا للتدريب والاستشارات، ومرافق رياضية وترفيهية، وأنشطة طلابية متنوعة تساعد على تطوير مهارات الطلاب خارج الدراسة. وتوفر الجامعة كذلك خدمات للنقل والسكن للطلاب، مما يجعل تجربة الدراسة أكثر تكاملا.'
WHERE slug = 'pharos-university-in-alexandria';

UPDATE "University" SET description = 'Rashid University is a private non-profit university in New Rashid City, Beheira Governorate, focused on education linked to the needs of the job market and to development in the region. The university offers specializations in fields such as physical therapy, nursing and business administration, with an emphasis on hands-on training and scientific research. It also aims to prepare specialized professionals able to meet the needs of different sectors, while providing students with a modern university environment.',
  "descriptionAr" = 'جامعة رشيد هي جامعة خاصة غير هادفة للربح تقع في مدينة رشيد الجديدة بمحافظة البحيرة، وتركز على تقديم تعليم يرتبط باحتياجات سوق العمل والتنمية في المنطقة. وتوفر الجامعة تخصصات في مجالات مثل العلاج الطبيعي والتمريض وإدارة الأعمال، مع اهتمام بالتدريب العملي والبحث العلمي. كما تستهدف إعداد كوادر متخصصة قادرة على تلبية احتياجات القطاعات المختلفة، مع توفير بيئة جامعية حديثة للطلاب.'
WHERE slug = 'rashid-university';

UPDATE "University" SET description = 'Ryada University for Science and Technology is a private university in Sadat City, offering a learning experience focused on practical application and linking study to the needs of the job market. The university has specializations in medical fields, engineering, computing and artificial intelligence, and business administration, with labs and equipment that help students gain practical experience. It also values student and sports activities, and provides a modern campus environment that helps students develop their skills alongside their studies. The university places particular emphasis on training, scientific research and entrepreneurship, helping students prepare for their professional lives.',
  "descriptionAr" = 'جامعة الريادة للعلوم والتكنولوجيا هي جامعة خاصة تقع في مدينة السادات، وتقدم تجربة تعليمية تركز على التطبيق العملي وربط الدراسة باحتياجات سوق العمل. تضم الجامعة تخصصات في المجالات الطبية والهندسية والحاسبات والذكاء الاصطناعي وإدارة الأعمال، مع معامل وتجهيزات تساعد الطلاب على اكتساب الخبرة العملية. كما تهتم الجامعة بالأنشطة الطلابية والرياضية، وتوفر بيئة جامعية حديثة تساعد الطلاب على تطوير مهاراتهم إلى جانب الدراسة. وتمنح الجامعة اهتماما خاصا بالتدريب والبحث العلمي وريادة الأعمال، بما يساعد الطلاب على الاستعداد للحياة المهنية.'
WHERE slug = 'ryada-university-for-science-and-technology';

UPDATE "University" SET description = 'Sinai University is a private university with two branches, in Arish and in El Qantara East in Ismailia Governorate, offering a learning experience focused on applied study and scientific research using the latest teaching methods and technologies. The Qantara branch has faculties of dentistry, pharmacy, engineering, information technology and computer science, mass communication, business administration and physical therapy, with ongoing development of its programs to match the needs of the job market. The university also has a center for scientific research and sustainable development, with units for central labs, research projects and training, and offers postgraduate programs including diplomas, master''s and doctoral degrees. It also stands out for teaching in English and for supporting international academic and research cooperation.',
  "descriptionAr" = 'جامعة سيناء هي جامعة خاصة لها فرعان في العريش والقنطرة شرق بمحافظة الإسماعيلية، وتقدم تجربة تعليمية تركز على الدراسة التطبيقية والبحث العلمي باستخدام أحدث أساليب وتقنيات التعليم. ويضم فرع القنطرة كليات طب الأسنان والصيدلة والهندسة وتكنولوجيا المعلومات وعلوم الحاسب والإعلام وإدارة الأعمال والعلاج الطبيعي، مع اهتمام بتطوير البرامج التعليمية بما يتوافق مع احتياجات سوق العمل. كما تضم الجامعة مركزا للبحث العلمي والتنمية المستدامة، ووحدات للمعامل المركزية والمشروعات البحثية والتدريب، وتوفر برامج للدراسات العليا تشمل الدبلوم والماجستير والدكتوراه. وتتميز الجامعة كذلك باستخدام اللغة الإنجليزية في التعليم، ودعم التعاون الأكاديمي والبحثي الدولي.'
WHERE slug = 'sinai-university';

UPDATE "University" SET description = 'University of East Capital is a private non-profit university in Mostakbal City, Haykestep, offering an educational model focused on linking study to the job market and practical application. The university has smart labs and classrooms and specialized training equipment, with a focus on medicine, dentistry, pharmacy, physical therapy, engineering, computing, business administration, mass communication, and arts and design. Among its key initiatives is a complex of teaching factories on campus, which lets students train in a real industrial environment and connect their projects to practical application. The university also invests in artificial intelligence, innovation and scientific research, and aims to turn student projects into applications and startups, while providing a modern campus environment that supports learning and professional development.',
  "descriptionAr" = 'جامعة شرق العاصمة هي جامعة خاصة غير هادفة للربح، تقع في مدينة المستقبل بالهايكستب، وتقدم نموذجا تعليميا يركز على ربط الدراسة بسوق العمل والتطبيق العملي. تتميز الجامعة بمعامل وقاعات ذكية وتجهيزات متخصصة للتدريب، مع تركيز على مجالات الطب وطب الأسنان والصيدلة والعلاج الطبيعي والهندسة والحاسبات وإدارة الأعمال والإعلام والفنون والتصميم. ومن أبرز توجهاتها إنشاء مجمع للمصانع التعليمية داخل الحرم يتيح للطلاب التدريب في بيئة صناعية حقيقية وربط المشروعات بالتطبيق العملي. كما تهتم الجامعة بالذكاء الاصطناعي والابتكار والبحث العلمي، وتسعى إلى تحويل مشروعات الطلاب إلى تطبيقات وشركات ناشئة، مع توفير بيئة جامعية حديثة تدعم التعلم والتطوير المهني.'
WHERE slug = 'university-of-east-capital';

UPDATE "University" SET description = 'The University of London gives students in Egypt the chance to earn a University of London degree through its recognized teaching center at the European Universities in Egypt (EUE) in the New Administrative Capital. Its programs cover a range of fields such as computer science, business administration, economics and finance, law, psychology, and politics and international relations, including programs under the academic direction of leading British institutions such as the London School of Economics (LSE). Students benefit from studying in Egypt while earning a qualification from the University of London, along with foundation programs that help them prepare for university study. Some programs also offer the chance to study locally while drawing on international academic resources and expertise.',
  "descriptionAr" = 'تتيح جامعة لندن للطلاب في مصر الحصول على درجة جامعية من جامعة لندن من خلال مركزها التعليمي المعتمد في الجامعات الأوروبية في مصر (EUE) بالعاصمة الإدارية الجديدة. وتتميز البرامج بتنوعها في مجالات مثل علوم الحاسب، إدارة الأعمال، الاقتصاد والتمويل، القانون، علم النفس والسياسة والعلاقات الدولية، مع وجود برامج ذات توجيه أكاديمي من مؤسسات بريطانية مرموقة مثل London School of Economics (LSE). ويستفيد الطلاب من الدراسة داخل مصر مع الحصول على مؤهل من جامعة لندن، إلى جانب برامج تأسيسية تساعد الطلاب على الاستعداد للدراسة الجامعية. كما توفر بعض البرامج فرصا للدراسة محليا مع إمكانية الاستفادة من الموارد والخبرة الأكاديمية الدولية.'
WHERE slug = 'university-of-london-egypt';

UPDATE "University" SET description = 'Zewail City of Science and Technology is a non-profit scientific and research institution that offers students a distinctive experience focused mainly on science, technology, research and innovation. Its University of Science and Technology offers specialized programs in engineering, science, pharmacy and medical sciences, with a strong reliance on research-based and project-based learning and lab work. The campus also stands out for its advanced research centers and labs, which let students take part in research projects in fields such as artificial intelligence, energy, water and biological sciences. The City also provides an academic environment that brings university study and scientific research together in one place, with opportunities for training and for taking part in conferences and research projects.',
  "descriptionAr" = 'مدينة زويل للعلوم والتكنولوجيا هي مؤسسة علمية وبحثية غير هادفة للربح، وتقدم للطلاب تجربة مختلفة تركز بشكل أساسي على العلوم والتكنولوجيا والبحث والابتكار. تضم جامعة العلوم والتكنولوجيا برامج متخصصة في الهندسة والعلوم والصيدلة والعلوم الطبية، مع اعتماد كبير على التعلم القائم على البحث والمشروعات والعمل داخل المعامل. كما يتميز الحرم بوجود مراكز ومعامل بحثية متقدمة تتيح للطلاب المشاركة في مشروعات بحثية في مجالات مثل الذكاء الاصطناعي والطاقة والمياه والعلوم الحيوية. وتوفر المدينة أيضا بيئة أكاديمية تجمع بين الدراسة الجامعية والبحث العلمي في مكان واحد، مع فرص للتدريب والمشاركة في المؤتمرات والمشروعات البحثية.'
WHERE slug = 'zewail-city-of-science-technology-and-innovation';

UPDATE "University" SET description = 'The German International University (GIU) operates according to the German higher education model and is located in the New Administrative Capital, with a strong focus on applied education and linking study to the needs of the job market. It offers specialized programs in engineering and robotics, informatics and computer science, business administration, biotechnology, pharmaceutical engineering, design, and physical therapy. Programs are taught in English, with strong academic ties to a number of German universities of applied sciences, and some programs offer opportunities for dual degrees and study in Germany. The university also stands out for its focus on scientific research and newer specializations, such as artificial intelligence, information and data security, logistics and digital design, along with scholarships for high-achieving students.',
  "descriptionAr" = 'الجامعة الألمانية الدولية (GIU) هي جامعة تعمل وفقا لنموذج التعليم العالي الألماني وتقع في العاصمة الإدارية الجديدة، وتتميز بتركيزها على التعليم التطبيقي وربط الدراسة باحتياجات سوق العمل. وتقدم برامج متخصصة في مجالات الهندسة والروبوتات، المعلوماتية وعلوم الحاسب، إدارة الأعمال، التكنولوجيا الحيوية، الهندسة الصيدلية، التصميم والعلاج الطبيعي. وتدرس البرامج باللغة الإنجليزية، مع ارتباط أكاديمي قوي بعدد من الجامعات الألمانية التطبيقية، كما تتيح بعض البرامج فرصا للحصول على درجات مزدوجة والدراسة في ألمانيا. وتتميز الجامعة كذلك باهتمامها بالبحث العلمي والتخصصات الحديثة، مثل الذكاء الاصطناعي وأمن المعلومات والبيانات واللوجستيات والتصميم الرقمي، مع وجود منح دراسية للطلاب المتفوقين.'
WHERE slug = 'german-international-university';

UPDATE "University" SET description = 'Memphis University is a private university in 6th of October City, focused on education that combines academic study with practical application, with an emphasis on preparing students for the job market. The university offers programs in fields such as medicine, dentistry, pharmacy, physical therapy, engineering, computing and artificial intelligence, business administration, mass communication, and arts and design. It also has specialized labs and training workshops that help students gain practical experience, along with a focus on scientific research and innovation. The university also offers student, sports and cultural activities, with on-campus services and facilities that support the student experience throughout their studies.',
  "descriptionAr" = 'جامعة ممفيس هي جامعة خاصة تقع في مدينة السادس من أكتوبر، وتركز على تقديم تعليم يجمع بين الدراسة الأكاديمية والتطبيق العملي، مع اهتمام بتأهيل الطلاب لسوق العمل. وتوفر الجامعة برامج في مجالات مثل الطب وطب الأسنان والصيدلة والعلاج الطبيعي والهندسة والحاسبات والذكاء الاصطناعي وإدارة الأعمال والإعلام والفنون والتصميم. كما تضم معامل وورش تدريب متخصصة تساعد الطلاب على اكتساب الخبرة العملية، إلى جانب الاهتمام بالبحث العلمي والابتكار. وتوفر الجامعة كذلك أنشطة طلابية ورياضية وثقافية، مع خدمات ومرافق داخل الحرم لدعم تجربة الطالب طوال فترة الدراسة.'
WHERE slug = 'memphis-university';


-- ===== prisma/seed/university-founding-years-2026-10-08.sql
-- Founding years confirmed by the client (2026-10-08): Badr University in
-- Cairo since 2010, Al Salam University since 2018. The descriptions applied
-- earlier the same day said 2013 for Badr, so its text is corrected to match;
-- Al Salam's description already said 2018, only the stat field was off.


UPDATE "University"
SET "establishedYear" = 2010,
  description = replace(description, 'founded in 2013', 'founded in 2010'),
  "descriptionAr" = replace("descriptionAr", 'تأسست عام 2013', 'تأسست عام 2010')
WHERE slug = 'badr-university-in-cairo';

UPDATE "University" SET "establishedYear" = 2018
WHERE slug = 'al-salam-university';


-- ===== prisma/seed/university-tuition-2026-10-10.sql
-- Faculties and 2026/2027 tuition for ten universities that had none, from
-- the client sheet "مصروفات_الجامعات_المصرية_2026_2027 (6).xlsx" (2026-10-10).
-- Where a university publishes fee categories, the full (undiscounted) fee
-- is the tuition and every category is in the program description, the
-- same convention as the earlier tuition files. Campus-specific fees are
-- separate programs named after the campus. Safe to re-run: existing
-- faculties/programs (same slug) are left untouched.


-- Nile Valley University is in Fayoum (this sheet and the description sheet),
-- not Qena as previously recorded.
UPDATE "University" SET city = 'Fayoum', "cityAr" = 'الفيوم',
  "addressLine" = 'Hadayek Demo, Al-Hay Al-Momayaz, Fayoum Governorate',
  "addressLineAr" = 'حدائق دمو، الحي المميز، محافظة الفيوم'
WHERE slug = 'nile-valley-university';

-- universite-francaise-degypte
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b25921eb583447cc9fb6', u.id, 'Science, Engineering & Architecture', 'العلوم والهندسة والعمارة', 'science-engineering-and-architecture', 0, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6a154be63af34fdcb1fe', u.id, f.id, 'Science, Engineering & Architecture', 'العلوم والهندسة والعمارة', 'science-engineering-and-architecture', 'BACHELOR', 'engineering', 180000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €3,800 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 3,800 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'science-engineering-and-architecture' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f10f04a3783b4270ace1', u.id, 'Management & Information Systems', 'الإدارة ونظم المعلومات', 'management-and-information-systems', 1, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_738d7607325f42458f56', u.id, f.id, 'Management & Information Systems', 'الإدارة ونظم المعلومات', 'management-and-information-systems', 'BACHELOR', 'business_administration', 160000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €3,300 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 3,300 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'management-and-information-systems' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_437c4129bc8b478aa15a', u.id, 'Applied Languages & Humanities', 'اللغات التطبيقية والعلوم الإنسانية', 'applied-languages-and-humanities', 2, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5a4971c4791642f08738', u.id, f.id, 'Applied Languages & Humanities', 'اللغات التطبيقية والعلوم الإنسانية', 'applied-languages-and-humanities', 'BACHELOR', 'languages_translation', 130000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €2,800 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 2,800 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'applied-languages-and-humanities' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- egyptian-chinese-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_11f54437c1c14fcd8098', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 0, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_558ed7b721474a4ea609', u.id, f.id, 'Physical Therapy – Gesr El Suez Campus', 'العلاج الطبيعي – فرع جسر السويس', 'physical-therapy-gesr-el-suez-campus', 'BACHELOR', 'physical_therapy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f36ba49d29ae4290a6ca', u.id, 'Faculty of Pharmacy & Drug Technology', 'كلية الصيدلة وتكنولوجيا الدواء', 'faculty-of-pharmacy-and-drug-technology', 1, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_88e3b773fc2d4b649c21', u.id, f.id, 'Pharmacy & Drug Technology – Gesr El Suez Campus', 'الصيدلة وتكنولوجيا الدواء – فرع جسر السويس', 'pharmacy-and-drug-technology-gesr-el-suez-campus', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy-and-drug-technology' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c4be4fcae9ef4e749548', u.id, 'Faculty of Engineering & Technology', 'كلية الهندسة والتكنولوجيا', 'faculty-of-engineering-and-technology', 2, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_25661ccde0e248b6ac6a', u.id, f.id, 'Engineering & Technology – Gesr El Suez Campus', 'الهندسة والتكنولوجيا – فرع جسر السويس', 'engineering-and-technology-gesr-el-suez-campus', 'BACHELOR', 'engineering', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering-and-technology' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_77295ee5c298401593e6', u.id, 'Faculty of Economics & International Trade', 'كلية الاقتصاد والتجارة الدولية', 'faculty-of-economics-and-international-trade', 3, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ba09b671d68748c0a1c5', u.id, f.id, 'Economics & International Trade – Gesr El Suez Campus', 'الاقتصاد والتجارة الدولية – فرع جسر السويس', 'economics-and-international-trade-gesr-el-suez-campus', 'BACHELOR', 'business_administration', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-international-trade' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_003712a7e2064a84a781', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 4, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a5c6847af51448dd8924', u.id, f.id, 'Veterinary Medicine – Nasr City Campus', 'الطب البيطري – فرع مدينة نصر', 'veterinary-medicine-nasr-city-campus', 'BACHELOR', 'veterinary', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_8cf3396ea1d2455ebbd1', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 5, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2892228587aa452c9901', u.id, f.id, 'Nursing – Nasr City Campus', 'التمريض – فرع مدينة نصر', 'nursing-nasr-city-campus', 'BACHELOR', 'nursing', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_cf6e869b50cb45839be4', u.id, 'Faculty of Computers & Information Systems', 'كلية الحاسبات ونظم المعلومات', 'faculty-of-computers-and-information-systems', 6, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a91618064ddc4114bcad', u.id, f.id, 'Computers & Information Systems – Nasr City Campus', 'الحاسبات ونظم المعلومات – فرع مدينة نصر', 'computers-and-information-systems-nasr-city-campus', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-information-systems' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d87701336f0b433f8816', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 7, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d6fecf388d0d45b19ef5', u.id, f.id, 'Arts & Design – Nasr City Campus', 'الفنون والتصميم – فرع مدينة نصر', 'arts-and-design-nasr-city-campus', 'BACHELOR', 'applied_arts', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_671eac29197249a583fb', u.id, 'Faculty of Mass Communication', 'كلية الإعلام', 'faculty-of-mass-communication', 8, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6ba708bb870241ff8324', u.id, f.id, 'Mass Communication – Nasr City Campus', 'الإعلام – فرع مدينة نصر', 'mass-communication-nasr-city-campus', 'BACHELOR', 'mass_communication', 53000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-mass-communication' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_91a2eb54b6bc41cfb429', u.id, 'Faculty of Literary Studies', 'كلية الدراسات الأدبية', 'faculty-of-literary-studies', 9, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8f12314cae3d464bb019', u.id, f.id, 'Literary Studies – Nasr City Campus', 'الدراسات الأدبية – فرع مدينة نصر', 'literary-studies-nasr-city-campus', 'BACHELOR', 'arts_humanities', 53000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-literary-studies' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9b14ffd082ce47929deb', u.id, 'Faculty of Law', 'كلية القانون', 'faculty-of-law', 10, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_177097d619cd44809ecb', u.id, f.id, 'Law – Nasr City Campus', 'القانون – فرع مدينة نصر', 'law-nasr-city-campus', 'BACHELOR', 'law', 48000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-law' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bca5bdb7e5894ba2bb0c', u.id, 'Faculty of Humanities', 'كلية الإنسانيات', 'faculty-of-humanities', 11, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_41baa0132a4d47f7a8e1', u.id, f.id, 'Geographic Information Systems – Nasr City Campus', 'نظم المعلومات الجغرافية – فرع مدينة نصر', 'geographic-information-systems-nasr-city-campus', 'BACHELOR', 'arts_humanities', 44000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-humanities' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- canadian-international-college
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b7677167ae924b7d81d6', u.id, 'School of Business', 'كلية إدارة الأعمال', 'school-of-business', 0, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cd9a3d87037d4fab8fcc', u.id, f.id, 'Business – Sheikh Zayed Campus', 'إدارة الأعمال – فرع الشيخ زايد', 'business-sheikh-zayed-campus', 'BACHELOR', 'business_administration', 31763, 'YEAR', 'EGP', 'Per course: EGP 2,888 (11 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 2,888 (11 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-business' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_63d2d667485946c99fda', u.id, f.id, 'Business – New Cairo Campus', 'إدارة الأعمال – فرع القاهرة الجديدة', 'business-new-cairo-campus', 'BACHELOR', 'business_administration', 45912, 'YEAR', 'EGP', 'Per course: EGP 4,389 (11 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 4,389 (11 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-business' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a02d8aeaa555402daf4b', u.id, 'School of Computer Science', 'كلية علوم الحاسب', 'school-of-computer-science', 1, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_caf11307d7f7476a88ae', u.id, f.id, 'Computer Science – Sheikh Zayed Campus', 'علوم الحاسب – فرع الشيخ زايد', 'computer-science-sheikh-zayed-campus', 'BACHELOR', 'computer_science', 40898, 'YEAR', 'EGP', 'Per credit hour: EGP 1,169 (35 credit hours a year).', 'سعر الساعة المعتمدة: 1,169 جنيه (35 ساعة معتمدة سنويًا).', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-computer-science' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d64d51f7efd4441f866f', u.id, f.id, 'Computer Science – New Cairo Campus', 'علوم الحاسب – فرع القاهرة الجديدة', 'computer-science-new-cairo-campus', 'BACHELOR', 'computer_science', 40898, 'YEAR', 'EGP', 'Per credit hour: EGP 1,169 (35 credit hours a year).', 'سعر الساعة المعتمدة: 1,169 جنيه (35 ساعة معتمدة سنويًا).', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-computer-science' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_67a54ff144fe485e8c82', u.id, 'School of Engineering', 'كلية الهندسة', 'school-of-engineering', 2, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3561343134ac45bb80cc', u.id, f.id, 'Engineering – New Cairo Campus', 'الهندسة – فرع القاهرة الجديدة', 'engineering-new-cairo-campus', 'BACHELOR', 'engineering', 45912, 'YEAR', 'EGP', 'Per course: EGP 3,826 (12 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 3,826 (12 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-engineering' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bbd02c8f7ea7439a95cd', u.id, 'School of Mass Communication', 'كلية الإعلام', 'school-of-mass-communication', 3, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0d07225a53ee4d0b8cb9', u.id, f.id, 'Mass Communication – New Cairo Campus', 'الإعلام – فرع القاهرة الجديدة', 'mass-communication-new-cairo-campus', 'BACHELOR', 'mass_communication', 44352, 'YEAR', 'EGP', 'Per course: EGP 3,696 (12 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 3,696 (12 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-mass-communication' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- al-hayah-university-in-cairo
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_714c71100f8c445b871f', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 0, now() FROM "University" u WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a1abc7fbb93c4789ab72', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 90000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_275fbaf81e3343d0aca1', u.id, 'Faculty of Business Administration', 'كلية إدارة الأعمال', 'faculty-of-business-administration', 1, now() FROM "University" u WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f01d9c65c58645539492', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- new-mansoura-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_66381f4acaf749da8585', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d60e42677921400c869b', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 150000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1c2994a3a07e41549df8', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e0e65c54aa8c46da80ca', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_73f5b6020d0343218686', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_023acbbaf4744a2788c7', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_56755177ad4c487894ea', u.id, 'Faculty of Computer Science & Engineering', 'كلية علوم وهندسة الحاسب', 'faculty-of-computer-science-and-engineering', 3, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0e845b37919f4f0fb27e', u.id, f.id, 'Computer Science & Engineering', 'علوم وهندسة الحاسب', 'computer-science-and-engineering', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_07f4ae804e854946ae74', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_731e731306a041c581ce', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5965480ff3bc4b6185c6', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 5, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d7207438f4414d0d99d7', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_fa62587b4b594d5094fb', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 6, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cbcbe54271df496db9ff', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4e3c4d546f134d26883b', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 7, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_801ffd6281a844f19740', u.id, f.id, 'Science', 'العلوم', 'science', 'BACHELOR', 'science', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b09ba2843f4140819772', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 8, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7eae147617b34015aadf', u.id, f.id, 'Business', 'الأعمال', 'business', 'BACHELOR', 'business_administration', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_38663a9146224652af71', u.id, 'Faculty of Law', 'كلية القانون', 'faculty-of-law', 9, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_24f1af7d081944ad86c9', u.id, f.id, 'Law', 'القانون', 'law', 'BACHELOR', 'law', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-law' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- egyptian-informatics-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1ed39521ff544ecbbec5', u.id, 'Faculty of Computer & Information Sciences', 'كلية علوم الحاسب والمعلومات', 'faculty-of-computer-and-information-sciences', 0, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_be8345e4180647fba5db', u.id, f.id, 'Computer & Information Sciences', 'علوم الحاسب والمعلومات', 'computer-and-information-sciences', 'BACHELOR', 'computer_science', 198000, 'YEAR', 'EGP', 'First term: EGP 96,000 · Second term: EGP 102,000.', 'الترم الأول: 96,000 جنيه · الترم الثاني: 102,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-and-information-sciences' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_772d1b24ed0d4c9bb523', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 1, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2f5b63159f774b60b6b7', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 226800, 'YEAR', 'EGP', 'First term: EGP 113,400 · Second term: EGP 113,400.', 'الترم الأول: 113,400 جنيه · الترم الثاني: 113,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_0b338847193644a892f3', u.id, 'Faculty of Business Information Systems', 'كلية نظم معلومات الأعمال', 'faculty-of-business-information-systems', 2, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9406f8b217a74d2db216', u.id, f.id, 'Business Information Systems', 'نظم معلومات الأعمال', 'business-information-systems', 'BACHELOR', 'business_administration', 179200, 'YEAR', 'EGP', 'First term: EGP 95,200 · Second term: EGP 84,000.', 'الترم الأول: 95,200 جنيه · الترم الثاني: 84,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-information-systems' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c6779bf69a1b43dd890c', u.id, 'Faculty of Digital Arts & Design', 'كلية الفنون الرقمية والتصميم', 'faculty-of-digital-arts-and-design', 3, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2e880969badf465994aa', u.id, f.id, 'Digital Arts & Design', 'الفنون الرقمية والتصميم', 'digital-arts-and-design', 'BACHELOR', 'applied_arts', 201600, 'YEAR', 'EGP', 'First term: EGP 100,800 · Second term: EGP 100,800.', 'الترم الأول: 100,800 جنيه · الترم الثاني: 100,800 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-digital-arts-and-design' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- hertfordshire-university-egypt
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ab66e6b810654fc0a93a', u.id, 'Faculty of Business', 'كلية إدارة الأعمال', 'faculty-of-business', 0, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_173ea0f48a714fa6bce8', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ba225ff5c1224320b404', u.id, 'Faculty of Engineering & Computer Science', 'كلية الهندسة وعلوم الحاسب', 'faculty-of-engineering-and-computer-science', 1, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5e742ab04e6a4e309b42', u.id, f.id, 'Engineering & Computer Science', 'الهندسة وعلوم الحاسب', 'engineering-and-computer-science', 'BACHELOR', 'engineering', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering-and-computer-science' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_172bda27dc30463b9ab0', u.id, 'Faculty of Pharmaceutical Sciences & Pharmacy', 'كلية العلوم الصيدلانية والصيدلة', 'faculty-of-pharmaceutical-sciences-and-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac98ce2fae6946ffad34', u.id, f.id, 'Pharmacy (MPharm)', 'الصيدلة (MPharm)', 'pharmacy-mpharm', 'BACHELOR', 'pharmacy', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmaceutical-sciences-and-pharmacy' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bafd62ead98b4ef7a6a4', u.id, 'Faculty of Psychology, Nutrition & Neuroscience', 'كلية علم النفس والتغذية وعلوم الأعصاب', 'faculty-of-psychology-nutrition-and-neuroscience', 3, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_398531cf877941809099', u.id, f.id, 'Psychology, Nutrition & Neuroscience', 'علم النفس والتغذية وعلوم الأعصاب', 'psychology-nutrition-and-neuroscience', 'BACHELOR', 'health_sciences', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-psychology-nutrition-and-neuroscience' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_80bd2407dd4049b8ad3b', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 4, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f949d55e062241dfbb22', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a9642aeff6074fcea251', u.id, 'Faculty of Media', 'كلية الإعلام', 'faculty-of-media', 5, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_760bdf688dbe4c3b9fb5', u.id, f.id, 'Media', 'الإعلام', 'media', 'BACHELOR', 'mass_communication', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-media' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_442901c98f6e4da4a579', u.id, 'Faculty of Creative Arts', 'كلية الفنون الإبداعية', 'faculty-of-creative-arts', 6, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2a30c54ae5514bb08439', u.id, f.id, 'Creative Arts', 'الفنون الإبداعية', 'creative-arts', 'BACHELOR', 'applied_arts', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-creative-arts' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- university-of-london-egypt
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_cf5778fa30f84f6c991f', u.id, 'Economics, Management, Finance & Social Sciences', 'الاقتصاد والإدارة والتمويل والعلوم الاجتماعية', 'economics-management-finance-and-social-sciences', 0, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0bd5c93706434ca0a2a9', u.id, f.id, 'Economics & Politics', 'الاقتصاد والسياسة', 'economics-and-politics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f46ae55c62664e3dbd65', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_65695da7723d405cb082', u.id, f.id, 'Politics & International Relations', 'السياسة والعلاقات الدولية', 'politics-and-international-relations', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_89e1e605d09a4e09927a', u.id, f.id, 'Finance', 'التمويل', 'finance', 'BACHELOR', 'business_administration', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_178ba3aa9820480bb0b3', u.id, f.id, 'Economics', 'الاقتصاد', 'economics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_eb433239965547dda2e8', u.id, f.id, 'Economics & Finance', 'الاقتصاد والتمويل', 'economics-and-finance', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac53840657b542bc8a83', u.id, f.id, 'Economics & Management', 'الاقتصاد والإدارة', 'economics-and-management', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_54783d9b5ecd488486c6', u.id, f.id, 'Data Science & Business Analytics', 'علوم البيانات وتحليلات الأعمال', 'data-science-and-business-analytics', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9d3f5c7f546b41ecb903', u.id, f.id, 'International Development', 'التنمية الدولية', 'international-development', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_23ca7bc7b8e348eb908e', u.id, f.id, 'Mathematics & Economics', 'الرياضيات والاقتصاد', 'mathematics-and-economics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a239594de5b94b5f959b', u.id, 'Law', 'القانون', 'law', 1, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7782db7c94ae4668b830', u.id, f.id, 'Law', 'القانون', 'law', 'BACHELOR', 'law', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'law' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_47e83e44a77e45e5a382', u.id, 'Psychology', 'علم النفس', 'psychology', 2, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0092d3fe2a0f45f8b365', u.id, f.id, 'Psychology', 'علم النفس', 'psychology', 'BACHELOR', 'arts_humanities', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'psychology' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_aa1442be317d4c78abc0', u.id, 'Computer Science', 'علوم الحاسبات', 'computer-science', 3, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d76ab6a804bd43adaf41', u.id, f.id, 'Computer Science', 'علوم الحاسبات', 'computer-science', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a970819248ae488a9a6f', u.id, f.id, 'Machine Learning & Artificial Intelligence', 'تعلم الآلة والذكاء الاصطناعي', 'machine-learning-and-artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_39e2f5affc5d4afd991d', u.id, f.id, 'Web & Mobile Development', 'تطوير الويب والهاتف المحمول', 'web-and-mobile-development', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f95748d34f0440e3a7c5', u.id, f.id, 'Physical Computing & Internet of Things', 'الحوسبة المادية وإنترنت الأشياء', 'physical-computing-and-internet-of-things', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d75f26d5accb4764adf0', u.id, f.id, 'Game Development', 'تطوير الألعاب', 'game-development', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5bff194c684f494fb993', u.id, f.id, 'Virtual Reality', 'الواقع الافتراضي', 'virtual-reality', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f9f43592c9104457b294', u.id, f.id, 'User Experience', 'تجربة المستخدم', 'user-experience', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- zewail-city-of-science-technology-and-innovation
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_703220050b8b4fc99ef4', u.id, 'Faculty of Business', 'كلية إدارة الأعمال', 'faculty-of-business', 0, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_fe46558c590749f4a193', u.id, f.id, 'Business', 'إدارة الأعمال', 'business', 'BACHELOR', 'business_administration', 112000, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 56,000 EGP · Category 2 (25% discount): 84,000 EGP · Category 3 (no discount): 112,000 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 56,000 جنيه · الفئة الثانية (خصم 25%): 84,000 جنيه · الفئة الثالثة (بدون خصم): 112,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4ce628c2f3de4a808a41', u.id, 'Faculty of Computational Sciences & Artificial Intelligence', 'كلية علوم الحوسبة والذكاء الاصطناعي', 'faculty-of-computational-sciences-and-artificial-intelligence', 1, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9cd1b801817f42399e77', u.id, f.id, 'Computational Sciences & Artificial Intelligence', 'علوم الحوسبة والذكاء الاصطناعي', 'computational-sciences-and-artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 137984, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 68,992 EGP · Category 2 (25% discount): 103,488 EGP · Category 3 (no discount): 137,984 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 68,992 جنيه · الفئة الثانية (خصم 25%): 103,488 جنيه · الفئة الثالثة (بدون خصم): 137,984 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computational-sciences-and-artificial-intelligence' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_66204ed188c14872915d', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 2, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_edbb9745b44947ed9da2', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 173880, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 86,940 EGP · Category 2 (25% discount): 130,410 EGP · Category 3 (no discount): 173,880 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 86,940 جنيه · الفئة الثانية (خصم 25%): 130,410 جنيه · الفئة الثالثة (بدون خصم): 173,880 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d3a152f8cd8645cfad2b', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 3, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c75bf86d4f1c4148b93d', u.id, f.id, 'Science', 'العلوم', 'science', 'BACHELOR', 'science', 141120, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 70,560 EGP · Category 2 (25% discount): 105,840 EGP · Category 3 (no discount): 141,120 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 70,560 جنيه · الفئة الثانية (خصم 25%): 105,840 جنيه · الفئة الثالثة (بدون خصم): 141,120 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- nile-valley-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_69f243aff9c349a1ae10', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 0, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9ba0a08686be4e7e9daa', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 139000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_64f72a1acb144d278a0d', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 1, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7e3509763312402ba1db', u.id, f.id, 'Clinical Pharmacy', 'الصيدلة الإكلينيكية', 'clinical-pharmacy', 'BACHELOR', 'pharmacy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2ca4badbfd304c84a473', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 2, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc75e5593a594a92b7f8', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 56000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_061d19f7d6cc43178940', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 3, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4b9aed9307b64e58aaea', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 58000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;


-- ===== prisma/seed/kayan-university-2026-10-10.sql
-- Kayan University (جامعة كيان), the Armed Forces' first civilian university,
-- added 2026-10-10. Fees and faculty minimums from the client sheet
-- "مصروفات_الجامعات_المصرية_2026_2027 (6).xlsx"; listed as PRIVATE per the
-- client. Location, faculties, program lists, durations and admission tests
-- from press coverage of the October 2026 intake (Al-Ahram Weekly, Al-Ahram,
-- Akhbar El Yom, filgamaa.com). No logo/photos published yet. Safe to re-run.


INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", description, "descriptionAr", "establishedYear", "addressLine", "addressLineAr", "publishedAt", "updatedAt")
VALUES ('univ_13e2c1693c294ccab007', 'Kayan University', 'جامعة كيان', 'kayan-university', 'PRIVATE', 'Egypt', 'مصر', 'New Administrative Capital', 'العاصمة الإدارية الجديدة', 'Kayan University is the first civilian university launched by the Egyptian Armed Forces, established under the law creating Kayan University of Applied Sciences. It is based inside the Egyptian Military Academy in the New Administrative Capital and takes its first intake in October 2026. It opens with six faculties: medicine, dentistry, pharmacy, physical therapy, engineering, and computers and artificial intelligence, supported by an integrated university hospital, a medical simulation center and a physical therapy and rehabilitation center. Admission is open to holders of Thanaweya Amma, Al-Azhar and equivalent certificates, and includes fitness, psychological and aptitude tests and a personal interview.', 'جامعة كيان هي أول جامعة مدنية تطلقها القوات المسلحة المصرية، وأُنشئت بموجب قانون إنشاء جامعة كيان للعلوم التطبيقية. تقع داخل الأكاديمية العسكرية بالعاصمة الإدارية الجديدة، وتستقبل أول دفعة من طلابها في أكتوبر 2026. تبدأ بست كليات هي الطب وطب الأسنان والصيدلة والعلاج الطبيعي والهندسة والحاسبات والذكاء الاصطناعي، مع مستشفى جامعي متكامل ومركز للمحاكاة الطبية ومركز للعلاج الطبيعي والتأهيل. يُقبل بها حاصلو الثانوية العامة والأزهرية والشهادات المعادلة، ويشمل القبول اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات والمقابلة الشخصية.', 2026, 'Egyptian Military Academy, New Administrative Capital', 'الأكاديمية العسكرية، العاصمة الإدارية الجديدة', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2c213172c09e44d7b7b5', u.id, 'Faculty of Medicine', 'كلية الطب', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_30928628ce804e52a691', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 84, '7 years (5 years of study + 2-year internship)', '7 سنوات (5 سنوات دراسة + سنتان امتياز)', 245000, 'YEAR', 'EGP', 90, 'Admission: minimum 90% (science stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 90% (شعبة علمي علوم)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_946df4b2c57545829e1e', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c368797e61d843b09364', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 72, '6 years (5 years of study + 1-year internship)', '6 سنوات (5 سنوات دراسة + سنة امتياز)', 242500, 'YEAR', 'EGP', 89, 'Admission: minimum 89% (science stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 89% (شعبة علمي علوم)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c19816c17dc147aeba73', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 2, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_15b9a539dc7441438016', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 72, '6 years (5 years of study + 1-year internship)', '6 سنوات (5 سنوات دراسة + سنة امتياز)', 205500, 'YEAR', 'EGP', 88, 'Admission: minimum 88% (science stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 88% (شعبة علمي علوم)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3f1a60b1e4bd4bd5abef', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 3, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_200d9c8a7a5544378f37', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 72, '6 years (5 years of study + 1-year internship)', '6 سنوات (5 سنوات دراسة + سنة امتياز)', 220500, 'YEAR', 'EGP', 87, 'Admission: minimum 87% (science stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 87% (شعبة علمي علوم)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_eacc9e9a3a3f4765abf7', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f5b227fb503b4754a94b', u.id, f.id, 'Electronics & Communications Engineering', 'هندسة الإلكترونيات والاتصالات', 'electronics-and-communications-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2eb91f11cab24d63ba0e', u.id, f.id, 'Electrical Power & Energy Engineering', 'هندسة القوى الكهربية والطاقة', 'electrical-power-and-energy-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_de0fd2076221453a9fc7', u.id, f.id, 'Biomedical Engineering', 'الهندسة الطبية', 'biomedical-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_738e41cb7ef947a3b5b2', u.id, f.id, 'Mechanical Power & Energy Engineering', 'هندسة القوى الميكانيكية والطاقة', 'mechanical-power-and-energy-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_68a53c6b64e24e6dbc18', u.id, f.id, 'Mechatronics Engineering', 'هندسة الميكاترونكس', 'mechatronics-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_45abefa06f4741938496', u.id, f.id, 'Design & Manufacturing Engineering', 'هندسة التصميم والتصنيع', 'design-and-manufacturing-engineering', 'BACHELOR', 'engineering', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 200000, 'YEAR', 'EGP', 85, 'Admission: minimum 85% (mathematics stream), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 85% (شعبة علمي رياضة)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_35e7280bb7dd4be38e2e', u.id, 'Faculty of Computers & Artificial Intelligence', 'كلية الحاسبات والذكاء الاصطناعي', 'faculty-of-computers-and-artificial-intelligence', 5, now() FROM "University" u WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3bf45650f93c41e1a35e', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 181000, 'YEAR', 'EGP', 80, 'Admission: minimum 80% (science section), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 80% (الشعبة العلمية)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5f270b7eaa214958b892', u.id, f.id, 'Software Engineering', 'البرمجيات', 'software-engineering', 'BACHELOR', 'computer_science', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 181000, 'YEAR', 'EGP', 80, 'Admission: minimum 80% (science section), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 80% (الشعبة العلمية)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e7e89047111e45e8aef6', u.id, f.id, 'Cybersecurity', 'الأمن السيبراني', 'cybersecurity', 'BACHELOR', 'computer_science', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 181000, 'YEAR', 'EGP', 80, 'Admission: minimum 80% (science section), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 80% (الشعبة العلمية)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_089fd2fcc7c841018ea7', u.id, f.id, 'Data Science', 'علوم البيانات', 'data-science', 'BACHELOR', 'computer_science', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 181000, 'YEAR', 'EGP', 80, 'Admission: minimum 80% (science section), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 80% (الشعبة العلمية)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "durationMonths", "durationLabel", "durationLabelAr", "tuitionFee", "tuitionPeriod", currency, "minGradePercent", description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f2098ff4f99143cdba0f', u.id, f.id, 'Intelligent Systems & Robotics', 'الأنظمة الذكية والروبوتات', 'intelligent-systems-and-robotics', 'BACHELOR', 'artificial_intelligence', 48, '4 years (credit hours)', '4 سنوات (نظام الساعات المعتمدة)', 181000, 'YEAR', 'EGP', 80, 'Admission: minimum 80% (science section), plus fitness, psychological and aptitude tests (English, computing, chemistry, biology and an intelligence test) and a personal interview. Applicants must be no older than 21 on 1 November 2026.', 'القبول: حد أدنى 80% (الشعبة العلمية)، واجتياز اختبارات اللياقة البدنية والاختبارات النفسية واختبارات القدرات (اللغة الإنجليزية والحاسب والكيمياء والأحياء واختبار الذكاء) والمقابلة الشخصية. ويُشترط ألا يزيد سن المتقدم على 21 عامًا في 1 نوفمبر 2026.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'kayan-university'
ON CONFLICT ("universityId", slug) DO NOTHING;


-- ===== prisma/seed/university-tuition-2026-10-10b.sql
-- From the client sheet "مصروفات_الجامعات_المصرية_2026_2027 (5).xlsx" (2026-10-10):
-- adds Benha National University (new) and the faculties and 2026/2027 fees
-- of Galala, New Alamein International and King Salman International, which
-- had none. Campus-specific King Salman fees are programs named after the
-- campus; New Alamein bills per term (tuition stored, administrative fee in
-- the description). Benha details from bnu.edu.eg and the Council of
-- National Universities. Safe to re-run.


INSERT INTO "University" (id, name, "nameAr", acronym, slug, type, country, "countryAr", city, "cityAr", description, "descriptionAr", "establishedYear", "websiteUrl", "logoUrl", "addressLine", "addressLineAr", "publishedAt", "updatedAt")
VALUES ('univ_43ca0ce261644a42894f', 'Benha National University', 'جامعة بنها الأهلية', 'BNU', 'benha-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Obour City', 'مدينة العبور', 'Benha National University is a national (ahleya) university established by Presidential Decree No. 369 of 2022 and located in Obour City, Qalyubia Governorate, on a 40-feddan campus. Teaching began in the 2022/2023 academic year with four faculties and has since grown to ten: medicine, dentistry, physical therapy, engineering, applied health sciences technology, economics and business administration, computer science, veterinary medicine, visual arts and design, and energy sciences. The faculties of visual arts, veterinary medicine and energy sciences were added by a 2023 presidential decree, and applied health sciences technology opens in the 2026/2027 academic year.', 'جامعة بنها الأهلية جامعة أهلية أُنشئت بقرار رئيس الجمهورية رقم 369 لسنة 2022، وتقع في مدينة العبور بمحافظة القليوبية على مساحة 40 فدانًا. بدأت الدراسة بها في العام الجامعي 2022/2023 بأربع كليات، ثم توسعت لتضم عشر كليات هي الطب البشري وطب الأسنان والعلاج الطبيعي والهندسة وتكنولوجيا العلوم الصحية التطبيقية والاقتصاد وإدارة الأعمال وعلوم الحاسب والطب البيطري والفنون البصرية والتصميم وعلوم الطاقة. وأُضيفت كليات الفنون البصرية والطب البيطري وعلوم الطاقة بقرار جمهوري عام 2023، وتبدأ الدراسة بكلية تكنولوجيا العلوم الصحية التطبيقية في العام الجامعي 2026/2027.', 2022, 'https://bnu.edu.eg', '/img/universities/benha-national-university/logo.png', 'Entertainment District, Obour Main Axis, Obour City, Qalyubia Governorate', 'الحي الترفيهي، محور العبور الرئيسي، مدينة العبور، محافظة القليوبية', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- galala-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bd00707f10514622881a', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2b93874927e6468b8e49', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 197000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c97750153b1f412598f7', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bf008006636b4cd28f1f', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 175000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d72ce65dce5b46bb873b', u.id, 'Faculty of Pharmaceutical Sciences', 'كلية العلوم الصيدلية', 'faculty-of-pharmaceutical-sciences', 2, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8afe7b56accc470daae1', u.id, f.id, 'Pharmaceutical Sciences', 'العلوم الصيدلية', 'pharmaceutical-sciences', 'BACHELOR', 'pharmacy', 123000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmaceutical-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_49791b2212674cd499f2', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 3, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2afe41fa37bb4a62a362', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 122000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_771e7517423641a3b2d7', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_864c4fe1a95842f68cba', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 100500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4a9402da100d432098ba', u.id, f.id, 'Computer Engineering', 'هندسة الحاسبات', 'computer-engineering', 'BACHELOR', 'engineering', 100500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f945461a65184c92b6ee', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_81b076a7a793459d8a5d', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 95380, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1680475f29d049279947', u.id, 'Faculty of Food & Food Industries', 'كلية الغذاء والصناعات الغذائية', 'faculty-of-food-and-food-industries', 6, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8663d8785c04460f871e', u.id, f.id, 'Food & Food Industries', 'الغذاء والصناعات الغذائية', 'food-and-food-industries', 'BACHELOR', 'agriculture', 61860, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-food-and-food-industries' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_978e8fac38884b96bd0e', u.id, 'Faculty of Social & Human Sciences', 'كلية العلوم الاجتماعية والإنسانية', 'faculty-of-social-and-human-sciences', 7, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a9a1e0dcaf2e4369a19b', u.id, f.id, 'Social & Human Sciences', 'العلوم الاجتماعية والإنسانية', 'social-and-human-sciences', 'BACHELOR', 'arts_humanities', 61860, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-social-and-human-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3fedb4b0207449f2a7f2', u.id, 'Faculty of Basic Sciences', 'كلية العلوم الأساسية', 'faculty-of-basic-sciences', 8, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_18876369a6d842a09e6a', u.id, f.id, 'Basic Sciences', 'العلوم الأساسية', 'basic-sciences', 'BACHELOR', 'science', 67960, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-basic-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bd9f9acd6fa446e4b9fc', u.id, 'Faculty of Administrative Sciences', 'كلية العلوم الإدارية', 'faculty-of-administrative-sciences', 9, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3a1f64889c9f420a9bd2', u.id, f.id, 'Administrative Sciences', 'العلوم الإدارية', 'administrative-sciences', 'BACHELOR', 'business_administration', 64920, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-administrative-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_96bdedb426204adb8e48', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 10, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_93872981596145f6aa7c', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 61840, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c4aa9777a6a04f5ba48f', u.id, 'Faculty of Nursing Sciences', 'كلية علوم التمريض', 'faculty-of-nursing-sciences', 11, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c9e1b8cac84149eca112', u.id, f.id, 'Nursing Sciences', 'علوم التمريض', 'nursing-sciences', 'BACHELOR', 'nursing', 61800, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_445844c6f186428cb404', u.id, 'Faculty of Media Production', 'كلية الإنتاج الإعلامي', 'faculty-of-media-production', 12, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ec1cd55378c549a792dd', u.id, f.id, 'Media Production', 'الإنتاج الإعلامي', 'media-production', 'BACHELOR', 'mass_communication', 69500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-media-production' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_27a93e634e8b4669ac2d', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 13, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0982c811d3994682b46b', u.id, f.id, 'Arts & Design', 'الفنون والتصميم', 'arts-and-design', 'BACHELOR', 'applied_arts', 70480, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- new-alamein-international-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3b01d0cf08b64fe2ba8e', u.id, 'Faculty of Advanced Basic Sciences', 'كلية العلوم الأساسية المتقدمة', 'faculty-of-advanced-basic-sciences', 0, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3c4d9ddd5b214a80b67b', u.id, f.id, 'Sustainable Energy', 'الطاقة المستدامة', 'sustainable-energy', 'BACHELOR', 'science', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_75c9a1d2ff54434784fa', u.id, f.id, 'Molecular Biotechnology', 'التكنولوجيا الحيوية الجزيئية', 'molecular-biotechnology', 'BACHELOR', 'biotechnology', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f38fffa1a84148e59912', u.id, f.id, 'Industrial Chemistry', 'الكيمياء الصناعية', 'industrial-chemistry', 'BACHELOR', 'science', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b80454c0f3d64835b7e9', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 1, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e4b1831337e6434ca05e', u.id, f.id, 'Interior Design', 'التصميم الداخلي', 'interior-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8718e6441dcb470eb39a', u.id, f.id, 'Graphic Design', 'التصميم الجرافيكي', 'graphic-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ed99f036db1d4c448557', u.id, f.id, 'Game Design', 'تصميم الألعاب', 'game-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3ea4a3da5d884fe79c16', u.id, f.id, 'Visual Arts', 'الفنون البصرية', 'visual-arts', 'BACHELOR', 'fine_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bf987f527a7c4e23b1ac', u.id, f.id, 'Fashion Design', 'تصميم الملابس', 'fashion-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_758c11e077474118a905', u.id, 'Faculty of Business Administration', 'كلية إدارة الأعمال', 'faculty-of-business-administration', 2, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_41e93e02770e4d0c8a99', u.id, f.id, 'Accounting & Information Systems', 'المحاسبة ونظم المعلومات', 'accounting-and-information-systems', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7e82532a4e7249009c5f', u.id, f.id, 'Marketing', 'التسويق', 'marketing', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc8bd0d4371047cebe25', u.id, f.id, 'Logistics & Supply Chain Management', 'اللوجستيات وإدارة سلاسل الإمداد', 'logistics-and-supply-chain-management', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2356fd821a58475185b4', u.id, 'Faculty of Computer Science & Engineering', 'كلية علوم وهندسة الحاسبات', 'faculty-of-computer-science-and-engineering', 3, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_57efba0994a549b19f6b', u.id, f.id, 'Computer Engineering', 'هندسة الحاسبات', 'computer-engineering', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8c7690c448d24b2c9624', u.id, f.id, 'Cybersecurity', 'الأمن السيبراني', 'cybersecurity', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f26eb51348d74014ac9c', u.id, f.id, 'Artificial Intelligence Engineering', 'هندسة الذكاء الاصطناعي', 'artificial-intelligence-engineering', 'BACHELOR', 'artificial_intelligence', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_80c250ef2de14a568f31', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f9c06c1214ee4046bb22', u.id, f.id, 'Software Engineering', 'هندسة البرمجيات', 'software-engineering', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ca552656c2574511b68f', u.id, f.id, 'Artificial Intelligence Science', 'علوم الذكاء الاصطناعي', 'artificial-intelligence-science', 'BACHELOR', 'artificial_intelligence', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5e2f853fa50d4100ae20', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 4, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_826352ffc4eb4206a7ed', u.id, f.id, 'Dental Medicine & Surgery', 'طب وجراحة الأسنان', 'dental-medicine-and-surgery', 'BACHELOR', 'dentistry', 69000, 'TERM', 'EGP', 'Per term: tuition EGP 69,000 plus administrative fees EGP 9,900.', 'للترم الواحد: مصروفات دراسية 69,000 جنيه بالإضافة إلى مصروفات إدارية 9,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4f8949fd25d04fecb141', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 5, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6d24b578eca541afbedf', u.id, f.id, 'Construction Management', 'إدارة الإنشاءات', 'construction-management', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_efad35987cf84025ab92', u.id, f.id, 'Architectural Design', 'التصميم المعماري', 'architectural-design', 'BACHELOR', 'architecture', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5ffa0483fab84a44b4d4', u.id, f.id, 'Biomedical Engineering', 'الهندسة الطبية الحيوية', 'biomedical-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6f816f6a6b334871b487', u.id, f.id, 'Petroleum & Gas Engineering', 'هندسة البترول والغاز', 'petroleum-and-gas-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ca4734fb9c8f47efbbc9', u.id, f.id, 'Mechatronics Engineering', 'هندسة الميكاترونكس', 'mechatronics-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9f3f920f454b494ab818', u.id, f.id, 'Electronics & Communications Engineering', 'هندسة الإلكترونيات والاتصالات', 'electronics-and-communications-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_963b071fd7cf4cff9584', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 6, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a115665b223b4eb8a389', u.id, f.id, 'Clinical Pharmacy (PharmD)', 'الصيدلة الإكلينيكية (PharmD)', 'clinical-pharmacy-pharmd', 'BACHELOR', 'pharmacy', 59500, 'TERM', 'EGP', 'Per term: tuition EGP 59,500 plus administrative fees EGP 8,900.', 'للترم الواحد: مصروفات دراسية 59,500 جنيه بالإضافة إلى مصروفات إدارية 8,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a0587e31149a4cc18974', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 7, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2b79e78bcc3a437da839', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 54000, 'TERM', 'EGP', 'Per term: tuition EGP 54,000 plus administrative fees EGP 8,900.', 'للترم الواحد: مصروفات دراسية 54,000 جنيه بالإضافة إلى مصروفات إدارية 8,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_19fd8e3b18184d2b808e', u.id, 'Faculty of Public Health', 'كلية الصحة العامة', 'faculty-of-public-health', 8, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_55a99702d0ae407c9888', u.id, f.id, 'Epidemiology & Biostatistics', 'الوبائيات والإحصاء الحيوي', 'epidemiology-and-biostatistics', 'BACHELOR', 'health_sciences', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-public-health' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- king-salman-international-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a112a5c96d1e42dc94f0', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9fd9821ade6c4a09a475', u.id, f.id, 'Medicine – El Tor Campus', 'الطب البشري – فرع الطور', 'medicine-el-tor-campus', 'BACHELOR', 'medicine', 152460, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ee9de76c95834145af4d', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b9432b1cdc564072a2a9', u.id, f.id, 'Dentistry – El Tor Campus', 'طب الأسنان – فرع الطور', 'dentistry-el-tor-campus', 'BACHELOR', 'dentistry', 125000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_97aae0e89f304ff8ba59', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 2, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_94426a2928f746648bd9', u.id, f.id, 'Nursing – El Tor Campus', 'التمريض – فرع الطور', 'nursing-el-tor-campus', 'BACHELOR', 'nursing', 44640, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9965e4144c2943dda5cc', u.id, 'Faculty of Technological Industries', 'كلية الصناعات التكنولوجية', 'faculty-of-technological-industries', 3, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2c069cb9161d457abe95', u.id, f.id, 'Technological Industries – El Tor Campus', 'الصناعات التكنولوجية – فرع الطور', 'technological-industries-el-tor-campus', 'BACHELOR', 'engineering', 42900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-technological-industries' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5f761e3affd54f549678', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc6484dee0a4437896e9', u.id, f.id, 'Engineering – El Tor Campus', 'الهندسة – فرع الطور', 'engineering-el-tor-campus', 'BACHELOR', 'engineering', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dcd9f88bdba24fcca7f7', u.id, f.id, 'Computer Engineering – El Tor Campus', 'هندسة الحاسب – فرع الطور', 'computer-engineering-el-tor-campus', 'BACHELOR', 'engineering', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a05809a9df994f7e813f', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_20b52621ddd4487e8cf2', u.id, f.id, 'Computer Science – El Tor Campus', 'علوم الحاسب – فرع الطور', 'computer-science-el-tor-campus', 'BACHELOR', 'computer_science', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2114d03b1de942d5ab8a', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 6, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f68412ba4e0f41399129', u.id, f.id, 'Physical Therapy – Sharm El Sheikh Campus', 'العلاج الطبيعي – فرع شرم الشيخ', 'physical-therapy-sharm-el-sheikh-campus', 'BACHELOR', 'physical_therapy', 93500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a4141ff8d18f4c8d8322', u.id, 'Faculty of Al-Alsun & Applied Languages', 'كلية الألسن واللغات التطبيقية', 'faculty-of-al-alsun-and-applied-languages', 7, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_367b888f6d2b44aea7b5', u.id, f.id, 'Al-Alsun & Applied Languages – Sharm El Sheikh Campus', 'الألسن واللغات التطبيقية – فرع شرم الشيخ', 'al-alsun-and-applied-languages-sharm-el-sheikh-campus', 'BACHELOR', 'languages_translation', 47300, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-al-alsun-and-applied-languages' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_095150c8b03b42febb49', u.id, 'Faculty of Tourism & Hospitality', 'كلية السياحة والضيافة', 'faculty-of-tourism-and-hospitality', 8, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dee51d20546840c6ae83', u.id, f.id, 'Tourism & Hospitality – Sharm El Sheikh Campus', 'السياحة والضيافة – فرع شرم الشيخ', 'tourism-and-hospitality-sharm-el-sheikh-campus', 'BACHELOR', 'tourism_hotels', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-tourism-and-hospitality' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9499280522cd4ee0b34a', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 9, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_99e5ea939dbe495d976e', u.id, f.id, 'Arts & Design – Sharm El Sheikh Campus', 'الفنون والتصميم – فرع شرم الشيخ', 'arts-and-design-sharm-el-sheikh-campus', 'BACHELOR', 'applied_arts', 53900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_71d8aec4428542598bdb', u.id, 'Faculty of Architectural Engineering', 'كلية هندسة العمارة', 'faculty-of-architectural-engineering', 10, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ad66dcdb3e744e60bd0c', u.id, f.id, 'Architectural Engineering – Sharm El Sheikh Campus', 'هندسة العمارة – فرع شرم الشيخ', 'architectural-engineering-sharm-el-sheikh-campus', 'BACHELOR', 'architecture', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-architectural-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_59d46e4effea412d9482', u.id, 'Faculty of Administrative Sciences', 'كلية العلوم الإدارية', 'faculty-of-administrative-sciences', 11, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4d4fe2940ffe4709b513', u.id, f.id, 'Administrative Sciences – Sharm El Sheikh Campus', 'العلوم الإدارية – فرع شرم الشيخ', 'administrative-sciences-sharm-el-sheikh-campus', 'BACHELOR', 'business_administration', 50600, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-administrative-sciences' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a581f14e70f74f40aca4', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 12, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a8f217c182e24ec9837d', u.id, f.id, 'Veterinary Medicine – Ras Sedr Campus', 'الطب البيطري – فرع رأس سدر', 'veterinary-medicine-ras-sedr-campus', 'BACHELOR', 'veterinary', 87120, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c88dcadc3a914620910a', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 13, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_77afa64254fa4c87bf93', u.id, f.id, 'Clinical Pharmacy – Ras Sedr Campus', 'الصيدلة الإكلينيكية – فرع رأس سدر', 'clinical-pharmacy-ras-sedr-campus', 'BACHELOR', 'pharmacy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b4ef5ef1eb484dc3bf2b', u.id, 'Faculty of Basic Sciences', 'كلية العلوم الأساسية', 'faculty-of-basic-sciences', 14, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9a93cb050bf94d1ea478', u.id, f.id, 'Basic Sciences – Ras Sedr Campus', 'العلوم الأساسية – فرع رأس سدر', 'basic-sciences-ras-sedr-campus', 'BACHELOR', 'science', 52800, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-basic-sciences' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2925b044b39f4c519107', u.id, 'Faculty of Desert Agriculture', 'كلية الزراعات الصحراوية', 'faculty-of-desert-agriculture', 15, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4fa2851d730340a8ba66', u.id, f.id, 'Desert Agriculture – Ras Sedr Campus', 'الزراعات الصحراوية – فرع رأس سدر', 'desert-agriculture-ras-sedr-campus', 'BACHELOR', 'agriculture', 47300, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-desert-agriculture' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- benha-national-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_424f0abf8faa44d08f1a', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d525c3ae6e184daba50d', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 170000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_59ace896bb2342f696b7', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e32c55bc7e3f4c13ae33', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9cf06be8119d4a01b2c0', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 2, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_58ec9a9dc4a04dc9a1aa', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_951c25ec46ff4a34b622', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 3, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c5345014173e48eba3c3', u.id, f.id, 'Veterinary Medicine', 'الطب البيطري', 'veterinary-medicine', 'BACHELOR', 'veterinary', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d9ff608cf9cd46a5bfbc', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9d8f49411fef452eba10', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_fa0d47d87ffa49708a4e', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6fd8760c1c604e079da7', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_db60156e092247ca9fa1', u.id, 'Faculty of Economics & Business Administration', 'كلية الاقتصاد وإدارة الأعمال', 'faculty-of-economics-and-business-administration', 6, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d25d3cd4bc6f4d668e8a', u.id, f.id, 'Economics & Business Administration', 'الاقتصاد وإدارة الأعمال', 'economics-and-business-administration', 'BACHELOR', 'business_administration', 52000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-business-administration' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3602330b784c42858adc', u.id, 'Faculty of Visual Arts & Design', 'كلية الفنون البصرية والتصميم', 'faculty-of-visual-arts-and-design', 7, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6f248f196a15485bbc28', u.id, f.id, 'Visual Arts & Design', 'الفنون البصرية والتصميم', 'visual-arts-and-design', 'BACHELOR', 'applied_arts', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-visual-arts-and-design' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_573e14af1a1a495b91df', u.id, 'Faculty of Energy Sciences', 'كلية علوم الطاقة', 'faculty-of-energy-sciences', 8, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c399b96f443a4bd38e09', u.id, f.id, 'Energy Sciences', 'علوم الطاقة', 'energy-sciences', 'BACHELOR', 'science', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-energy-sciences' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_12d54cc47ae6446795b5', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 9, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5fdfb193300a4f1a97bc', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', NULL, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;


-- ===== prisma/seed/aast-tuition-2026-10-11.sql
-- Arab Academy for Science, Technology & Maritime Transport: colleges,
-- programs and 2026/2027 fees (per term), from the client sheet
-- "مصروفات_الأكاديمية_العربية_2026_2027.xlsx" (2026-10-11). The sheet prices in
-- USD; Egypt and Sudan pay in EGP at EGP 23 per dollar (its footnote), so the
-- stored fee is the highest Egypt/Sudan category x 23, and every category
-- (both nationality groups) is in the description. El Alamein-only colleges
-- are named after that campus. Safe to re-run.


INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5f4d92498b134a2ebe39', u.id, 'College of Maritime Transport & Technology', 'كلية النقل البحري والتكنولوجيا', 'college-of-maritime-transport-and-technology', 0, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ed5d20be594d4e26b20e', u.id, f.id, 'Maritime Transport Technology', 'تكنولوجيا النقل البحري', 'maritime-transport-technology', 'BACHELOR', 'engineering', 148120, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,920 · B $5,680 · C $6,440, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,440). Other nationalities: Category A $5,795 · B $6,270 · C $7,030. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,920 دولار · (ب) 5,680 دولار · (ج) 6,440 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,440 دولار). أبناء الدول الأخرى: فئة (أ) 5,795 دولار · (ب) 6,270 دولار · (ج) 7,030 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-maritime-transport-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1f0a3ba0135f4b32a77c', u.id, f.id, 'Marine Engineering Technology', 'تكنولوجيا الهندسة البحرية', 'marine-engineering-technology', 'BACHELOR', 'engineering', 148120, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,920 · B $5,680 · C $6,440, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,440). Other nationalities: Category A $5,795 · B $6,270 · C $7,030. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,920 دولار · (ب) 5,680 دولار · (ج) 6,440 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,440 دولار). أبناء الدول الأخرى: فئة (أ) 5,795 دولار · (ب) 6,270 دولار · (ج) 7,030 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-maritime-transport-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d23c5cb5198846148bb3', u.id, 'College of Engineering & Technology', 'كلية الهندسة والتكنولوجيا', 'college-of-engineering-and-technology', 1, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_19f4a9e74ff9432fb22d', u.id, f.id, 'Computer Engineering', 'هندسة الحاسب', 'computer-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e3ab1c2c9ce3467dbe28', u.id, f.id, 'Electronics & Communications Engineering', 'هندسة الإلكترونيات والاتصالات', 'electronics-and-communications-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6b4571b6923c4822af49', u.id, f.id, 'Mechanical Engineering', 'الهندسة الميكانيكية', 'mechanical-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f41975b0e261424baa44', u.id, f.id, 'Electrical & Control Engineering', 'هندسة الكهرباء والتحكم', 'electrical-and-control-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6484cf89e98e49e28168', u.id, f.id, 'Construction & Building Engineering', 'هندسة التشييد والبناء', 'construction-and-building-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_75e6eb5e8cba4eac868a', u.id, f.id, 'Industrial & Management Engineering', 'الهندسة الصناعية والإدارية', 'industrial-and-management-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_553887fcdc1c4a32b9b7', u.id, f.id, 'Architectural Engineering', 'الهندسة المعمارية', 'architectural-engineering', 'BACHELOR', 'architecture', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8d5d4b215dfe4e6d8a3f', u.id, f.id, 'Petroleum & Gas Engineering', 'هندسة البترول والغاز', 'petroleum-and-gas-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_44578cae108f423c9e09', u.id, f.id, 'Chemical & Petrochemical Engineering', 'الهندسة الكيميائية والبتروكيماوية', 'chemical-and-petrochemical-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7dc97223dd604c22a2c7', u.id, f.id, 'Marine Engineering', 'الهندسة البحرية', 'marine-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cbb68f705c574b21a4e5', u.id, f.id, 'Electrical Power Engineering', 'هندسة الطاقة الكهربية', 'electrical-power-engineering', 'BACHELOR', 'engineering', 160540, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,360 · B $6,260 · C $6,980, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,980). Other nationalities: Category A $5,465 · B $6,455 · C $7,175. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,360 دولار · (ب) 6,260 دولار · (ج) 6,980 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,980 دولار). أبناء الدول الأخرى: فئة (أ) 5,465 دولار · (ب) 6,455 دولار · (ج) 7,175 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-engineering-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2681eef8f21b4afba530', u.id, 'College of Pharmacy', 'كلية الصيدلة', 'college-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8b5f95e09ae648e29d64', u.id, f.id, 'PharmD', 'دكتور صيدلة (Pharm D)', 'pharmd', 'BACHELOR', 'pharmacy', 170200, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $6,000 · B $7,000 · C $7,400, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $7,400). Other nationalities: Category A $6,200 · B $7,300 · C $7,700. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 6,000 دولار · (ب) 7,000 دولار · (ج) 7,400 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 7,400 دولار). أبناء الدول الأخرى: فئة (أ) 6,200 دولار · (ب) 7,300 دولار · (ج) 7,700 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-pharmacy' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_494ae15798b648e8a598', u.id, f.id, 'PharmD Clinical', 'دكتور صيدلة إكلينيكية (Pharm D Clinical)', 'pharmd-clinical', 'BACHELOR', 'pharmacy', 175950, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $6,250 · B $7,250 · C $7,650, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $7,650). Other nationalities: Category A $6,450 · B $7,550 · C $7,950. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 6,250 دولار · (ب) 7,250 دولار · (ج) 7,650 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 7,650 دولار). أبناء الدول الأخرى: فئة (أ) 6,450 دولار · (ب) 7,550 دولار · (ج) 7,950 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-pharmacy' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_22c46aa4e1f54a4cbc56', u.id, 'College of Dentistry', 'كلية طب الأسنان', 'college-of-dentistry', 3, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4ea8fe0014f2459191ad', u.id, f.id, 'Dental Medicine & Surgery – El Alamein Campus', 'طب وجراحة الأسنان – فرع العلمين', 'dental-medicine-and-surgery-el-alamein-campus', 'BACHELOR', 'dentistry', 183770, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $6,730 · B $7,630 · C $7,990, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $7,990). Other nationalities: Category A $6,910 · B $7,900 · C $8,260. Genoa University program: add $150 per term. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 6,730 دولار · (ب) 7,630 دولار · (ج) 7,990 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 7,990 دولار). أبناء الدول الأخرى: فئة (أ) 6,910 دولار · (ب) 7,900 دولار · (ج) 8,260 دولار. برنامج جامعة جنوة: يُضاف 150 دولارًا لكل فصل. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-dentistry' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5f578cbfee0d4a38b693', u.id, 'College of Computing & Information Technology', 'كلية الحاسبات وتكنولوجيا المعلومات', 'college-of-computing-and-information-technology', 4, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_11a8a510f7a341459abb', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d81aadc7f114484583f1', u.id, f.id, 'Information Systems', 'نظم المعلومات', 'information-systems', 'BACHELOR', 'computer_science', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8c74c6552c2c4030a87d', u.id, f.id, 'Software Engineering', 'هندسة البرمجيات', 'software-engineering', 'BACHELOR', 'computer_science', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1a021e10d2924e92a3f4', u.id, f.id, 'Multimedia & Computer Graphics', 'الوسائط المتعددة والكمبيوتر جرافيكس', 'multimedia-and-computer-graphics', 'BACHELOR', 'computer_science', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a75f3bcf81c249478ccf', u.id, f.id, 'Cybersecurity', 'الأمن السيبراني', 'cybersecurity', 'BACHELOR', 'computer_science', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_497f92ee6bea4df49e16', u.id, f.id, 'Artificial Intelligence', 'الذكاء الاصطناعي', 'artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 148810, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,210 · B $6,110 · C $6,470, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,470). Other nationalities: Category A $5,315 · B $6,305 · C $6,665. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,210 دولار · (ب) 6,110 دولار · (ج) 6,470 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,470 دولار). أبناء الدول الأخرى: فئة (أ) 5,315 دولار · (ب) 6,305 دولار · (ج) 6,665 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-computing-and-information-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bd82648a47dc48958a7a', u.id, 'College of Management & Technology', 'كلية الإدارة والتكنولوجيا', 'college-of-management-and-technology', 5, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f2f53b826ab14570aa3c', u.id, f.id, 'Marketing (Arabic)', 'التسويق (عربي)', 'marketing-arabic', 'BACHELOR', 'business_administration', 127351, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,737 · B $5,137 · C $5,537, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,537). Other nationalities: Category A $4,887 · B $5,287 · C $5,787. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,737 دولار · (ب) 5,137 دولار · (ج) 5,537 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,537 دولار). أبناء الدول الأخرى: فئة (أ) 4,887 دولار · (ب) 5,287 دولار · (ج) 5,787 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_eaf465a5c69541f09ada', u.id, f.id, 'Finance (Arabic)', 'التمويل (عربي)', 'finance-arabic', 'BACHELOR', 'business_administration', 127351, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,737 · B $5,137 · C $5,537, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,537). Other nationalities: Category A $4,887 · B $5,287 · C $5,787. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,737 دولار · (ب) 5,137 دولار · (ج) 5,537 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,537 دولار). أبناء الدول الأخرى: فئة (أ) 4,887 دولار · (ب) 5,287 دولار · (ج) 5,787 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_66ea237c85b44683b46f', u.id, f.id, 'Accounting (Arabic)', 'المحاسبة (عربي)', 'accounting-arabic', 'BACHELOR', 'business_administration', 127351, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,737 · B $5,137 · C $5,537, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,537). Other nationalities: Category A $4,887 · B $5,287 · C $5,787. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,737 دولار · (ب) 5,137 دولار · (ج) 5,537 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,537 دولار). أبناء الدول الأخرى: فئة (أ) 4,887 دولار · (ب) 5,287 دولار · (ج) 5,787 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1a2e07af34a744dc8428', u.id, f.id, 'Business Information Systems (Arabic)', 'نظم معلومات الأعمال (عربي)', 'business-information-systems-arabic', 'BACHELOR', 'business_administration', 127351, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,737 · B $5,137 · C $5,537, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,537). Other nationalities: Category A $4,887 · B $5,287 · C $5,787. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,737 دولار · (ب) 5,137 دولار · (ج) 5,537 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,537 دولار). أبناء الدول الأخرى: فئة (أ) 4,887 دولار · (ب) 5,287 دولار · (ج) 5,787 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_22a54643049248fc88ca', u.id, f.id, 'Marketing (English)', 'التسويق (إنجليزي)', 'marketing-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_69eb3517eec7433a867b', u.id, f.id, 'Finance (English)', 'التمويل (إنجليزي)', 'finance-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4604cc0b1fe24e988c89', u.id, f.id, 'Accounting (English)', 'المحاسبة (إنجليزي)', 'accounting-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_782cf64008fb47f3b4f2', u.id, f.id, 'Business Information Systems (English)', 'نظم معلومات الأعمال (إنجليزي)', 'business-information-systems-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7cec26fecebd445e97fa', u.id, f.id, 'Media Management (English)', 'إدارة الإعلام (إنجليزي)', 'media-management-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d8f33050df22441b9cd5', u.id, f.id, 'Digital Business & Sustainability (English)', 'الأعمال الرقمية والاستدامة (إنجليزي)', 'digital-business-and-sustainability-english', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a34aad3a6681430c9dbb', u.id, f.id, 'Political Science (English)', 'العلوم السياسية (إنجليزي)', 'political-science-english', 'BACHELOR', 'economics_political_science', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e2cdd3b11da849aab44b', u.id, f.id, 'Business Administration (French)', 'إدارة الأعمال (فرنسي)', 'business-administration-french', 'BACHELOR', 'business_administration', 152145, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,215 · B $6,215 · C $6,615, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,615). Other nationalities: Category A $5,365 · B $6,465 · C $6,865. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,215 دولار · (ب) 6,215 دولار · (ج) 6,615 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,615 دولار). أبناء الدول الأخرى: فئة (أ) 5,365 دولار · (ب) 6,465 دولار · (ج) 6,865 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-management-and-technology' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_fe2b13dcdcc347a58977', u.id, 'College of Hotel & Tourism Management', 'كلية السياحة والفندقة', 'college-of-hotel-and-tourism-management', 6, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_50f0088c53a240ea8f45', u.id, f.id, 'Tourism & Hotel Management', 'السياحة والفندقة', 'tourism-and-hotel-management', 'BACHELOR', 'tourism_hotels', 124453, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,651 · B $5,031 · C $5,411, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,411). Other nationalities: Category A $4,791 · B $5,171 · C $5,646. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,651 دولار · (ب) 5,031 دولار · (ج) 5,411 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,411 دولار). أبناء الدول الأخرى: فئة (أ) 4,791 دولار · (ب) 5,171 دولار · (ج) 5,646 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-hotel-and-tourism-management' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_84449e90dfbc4b328e8f', u.id, 'College of International Transport & Logistics', 'كلية النقل الدولي واللوجستيات', 'college-of-international-transport-and-logistics', 7, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ab8f5d1efef0424ca9d9', u.id, f.id, 'Logistics & Supply Chain Management (Arabic)', 'إدارة اللوجستيات وسلاسل الإمداد (عربي)', 'logistics-and-supply-chain-management-arabic', 'BACHELOR', 'business_administration', 121555, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,565 · B $4,925 · C $5,285, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,285). Other nationalities: Category A $4,695 · B $5,055 · C $5,505. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,565 دولار · (ب) 4,925 دولار · (ج) 5,285 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,285 دولار). أبناء الدول الأخرى: فئة (أ) 4,695 دولار · (ب) 5,055 دولار · (ج) 5,505 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_321133b448d04277b250', u.id, f.id, 'International Trade Logistics Management (Arabic)', 'إدارة لوجستيات التجارة الدولية (عربي)', 'international-trade-logistics-management-arabic', 'BACHELOR', 'business_administration', 121555, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,565 · B $4,925 · C $5,285, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,285). Other nationalities: Category A $4,695 · B $5,055 · C $5,505. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,565 دولار · (ب) 4,925 دولار · (ج) 5,285 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,285 دولار). أبناء الدول الأخرى: فئة (أ) 4,695 دولار · (ب) 5,055 دولار · (ج) 5,505 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_fa56b09825a84d5b933e', u.id, f.id, 'Transport Logistics Management (Arabic)', 'إدارة لوجستيات النقل (عربي)', 'transport-logistics-management-arabic', 'BACHELOR', 'business_administration', 121555, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $4,565 · B $4,925 · C $5,285, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $5,285). Other nationalities: Category A $4,695 · B $5,055 · C $5,505. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 4,565 دولار · (ب) 4,925 دولار · (ج) 5,285 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 5,285 دولار). أبناء الدول الأخرى: فئة (أ) 4,695 دولار · (ب) 5,055 دولار · (ج) 5,505 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c3e85e05822044879807', u.id, f.id, 'Logistics & Supply Chain Management (English)', 'إدارة اللوجستيات وسلاسل الإمداد (إنجليزي)', 'logistics-and-supply-chain-management-english', 'BACHELOR', 'business_administration', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c04529fee2bb4fc7b3b5', u.id, f.id, 'International Trade Logistics Management (English)', 'إدارة لوجستيات التجارة الدولية (إنجليزي)', 'international-trade-logistics-management-english', 'BACHELOR', 'business_administration', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f0cc82cf069e42b19c3d', u.id, f.id, 'Transport Logistics Management (English)', 'إدارة لوجستيات النقل (إنجليزي)', 'transport-logistics-management-english', 'BACHELOR', 'business_administration', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3061412fe4484eba92c7', u.id, f.id, 'Energy & Petroleum Logistics (English)', 'لوجستيات الطاقة والبترول (إنجليزي)', 'energy-and-petroleum-logistics-english', 'BACHELOR', 'business_administration', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e9878343f0a34e5797ae', u.id, f.id, 'International Transport & Logistics – El Alamein Campus', 'النقل الدولي واللوجستيات – فرع العلمين', 'international-transport-and-logistics-el-alamein-campus', 'BACHELOR', 'business_administration', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category B $5,250 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (ب) 5,250 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-international-transport-and-logistics' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_712c2a885ad14798b6f9', u.id, 'College of Language & Communication', 'كلية اللغة والإعلام', 'college-of-language-and-communication', 8, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_02da722e8b9b443994ab', u.id, f.id, 'Language & Translation', 'اللغة والترجمة', 'language-and-translation', 'BACHELOR', 'languages_translation', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Universidad Autónoma program: add $100. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. برنامج جامعة أتونوما: يُضاف 100 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-language-and-communication' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4b6d7e4aed7d4af0a474', u.id, f.id, 'Media', 'الإعلام', 'media', 'BACHELOR', 'mass_communication', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Universidad Autónoma program: add $100. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. برنامج جامعة أتونوما: يُضاف 100 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-language-and-communication' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_74aeeb08026d451e8013', u.id, 'College of Fisheries Technology & Aquaculture', 'كلية تكنولوجيا المصايد والاستزراع المائي', 'college-of-fisheries-technology-and-aquaculture', 9, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d329b9cacb934e74b979', u.id, f.id, 'Fisheries Technology', 'تكنولوجيا المصايد', 'fisheries-technology', 'BACHELOR', 'agriculture', 92805, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $3,655 · B $3,845 · C $4,035, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $4,035). Other nationalities: Category A $3,940 · B $4,130 · C $4,320. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 3,655 دولار · (ب) 3,845 دولار · (ج) 4,035 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 4,035 دولار). أبناء الدول الأخرى: فئة (أ) 3,940 دولار · (ب) 4,130 دولار · (ج) 4,320 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-fisheries-technology-and-aquaculture' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1dd93124854744568ab8', u.id, 'College of Law', 'كلية القانون', 'college-of-law', 10, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7efdfa13ff084116930a', u.id, f.id, 'Law (LLB)', 'ليسانس القانون', 'law-llb', 'BACHELOR', 'law', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Universidad Autónoma program: add $150. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. برنامج جامعة أتونوما: يُضاف 150 دولارًا. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-law' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_afb6d2dbef814d198796', u.id, 'College of Medicine', 'كلية الطب البشري', 'college-of-medicine', 11, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8e627d591c8848cfa994', u.id, f.id, 'Medicine – El Alamein Campus', 'الطب البشري – فرع العلمين', 'medicine-el-alamein-campus', 'BACHELOR', 'medicine', 221260, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $8,900 · B $9,170 · C $9,620, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $9,620). Fees for other nationalities are not listed. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 8,900 دولار · (ب) 9,170 دولار · (ج) 9,620 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 9,620 دولار). مصروفات أبناء الدول الأخرى غير مدرجة. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-medicine' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5c00ad6619e244e6a863', u.id, 'College of Art & Design', 'كلية الفنون والتصميم', 'college-of-art-and-design', 12, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_24a27b30a7a84286bbe4', u.id, f.id, 'Art & Design', 'الفنون والتصميم', 'art-and-design', 'BACHELOR', 'applied_arts', 144095, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category A $5,005 · B $5,905 · C $6,265, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,265). Other nationalities: Category A $5,135 · B $6,125 · C $6,485. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (أ) 5,005 دولار · (ب) 5,905 دولار · (ج) 6,265 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,265 دولار). أبناء الدول الأخرى: فئة (أ) 5,135 دولار · (ب) 6,125 دولار · (ج) 6,485 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-art-and-design' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_42fdab8460ce46dcb42c', u.id, 'College of Artificial Intelligence', 'كلية الذكاء الاصطناعي', 'college-of-artificial-intelligence', 13, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d9cf6b4474a04a78b957', u.id, f.id, 'Artificial Intelligence – El Alamein Campus', 'الذكاء الاصطناعي – فرع العلمين', 'artificial-intelligence-el-alamein-campus', 'BACHELOR', 'artificial_intelligence', 148465, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category B $5,810 · C $6,455, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $6,455). Other nationalities: Category B $6,455. Universidad Autónoma program: add $100. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (ب) 5,810 دولار · (ج) 6,455 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 6,455 دولار). أبناء الدول الأخرى: فئة (ب) 6,455 دولار. برنامج جامعة أتونوما: يُضاف 100 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-artificial-intelligence' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_e4cbc37e6e714f9b9a87', u.id, 'College of Physical Therapy', 'كلية العلاج الطبيعي', 'college-of-physical-therapy', 14, now() FROM "University" u WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_87639c4e3b444db58608', u.id, f.id, 'Physical Therapy – El Alamein Campus', 'العلاج الطبيعي – فرع العلمين', 'physical-therapy-el-alamein-campus', 'BACHELOR', 'physical_therapy', 173650, 'TERM', 'EGP', 'Per term. Egypt and Sudan: Category B $7,250 · C $7,550, paid in Egyptian pounds at EGP 23 per dollar (the fee shown is the highest category, $7,550). Other nationalities: Category C $7,550. Fees rise by $150 a year, with total increases capped at 15% a year.', 'للترم الواحد. مصر والسودان: فئة (ب) 7,250 دولار · (ج) 7,550 دولار، تُدفع بالجنيه المصري بسعر 23 جنيهًا للدولار (المصروفات المعروضة لأعلى فئة، 7,550 دولار). أبناء الدول الأخرى: فئة (ج) 7,550 دولار. تزيد المصروفات 150 دولارًا سنويًا، على ألا تتجاوز الزيادة الإجمالية 15% سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'college-of-physical-therapy' WHERE u.slug = 'arab-academy-for-science-technology-and-maritime-transport'
ON CONFLICT ("universityId", slug) DO NOTHING;


-- ===== prisma/seed/cairo-ain-shams-national-2026-10-13.sql
-- Cairo National University and Ain Shams National University (new national
-- universities, 2025 presidential decrees 245 and 246), added 2026-10-13 from the
-- client sheets cairo.xlsx and "Aim shams.xlsx": faculties, programs, Ain Shams
-- program descriptions and the About texts, in English and Arabic. Logos are
-- from the sheets / official site; covers from the universities' official pages.
-- The sheets give no fees or durations, so those stay empty. Safe to re-run.


INSERT INTO "University" (id, name, "nameAr", acronym, slug, type, country, "countryAr", city, "cityAr", description, "descriptionAr", "establishedYear", "websiteUrl", "logoUrl", "coverImageUrl", "addressLine", "addressLineAr", "publishedAt", "updatedAt")
VALUES ('univ_8951edaf7f944c089d79', 'Cairo National University', 'جامعة القاهرة الأهلية', 'CNU', 'cairo-national-university', 'NATIONAL', 'Egypt', 'مصر', '6th of October City', 'مدينة 6 أكتوبر', 'Cairo National University is a national (ahleya) university affiliated with Cairo University, established by Presidential Decree No. 245 of 2025 and located in 6th of October City. The strategic plan of Cairo National University is based on an analysis of the current situation of Cairo University, while taking into consideration the strategic vision for higher education in the Arab Republic of Egypt, which is derived from Egypt’s Vision 2030. This approach allows for the development of an ambitious, effective, and implementable strategy that aims to achieve excellence as a primary objective. It also reflects the available and anticipated resources and builds upon the historical strengths of Cairo University, while developing new fields and programs capable of moving the university toward new levels and horizons.', 'جامعة القاهرة الأهلية جامعة أهلية تابعة لجامعة القاهرة، أُنشئت بقرار رئيس الجمهورية رقم 245 لسنة 2025، ومقرها مدينة 6 أكتوبر. تعتمد الخطة الاستراتيجية للجامعة الأهلية لجامعة القاهرة على تحليل الوضع الحالي لجامعة القاهرة مع الاخذ في الحسبان الرؤية الاستراتيجية للتعليم العالي في جمهورية مصر العربية المستمد من رؤية مصر 2030 بما يسمح باعداد استراتيجية جريئة وفعالة وقلبلة للتنفيذ تعمل على تحقيق التمييز كهدف رئيسي وتعكس المدخلات المتاحة والمتوقعة للبناء على نقاط القوة التاريخية لجامعة القاهرة مع تطوير مجالات وبرامج جديدة تستطيع ان تنقل الجامعة الي مستويات وافاق مختلفة.', 2025, 'https://cnu.cu.edu.eg', '/img/universities/cairo-national-university/logo.png', '/img/universities/cairo-national-university/cover.jpg', 'Dahshur Link Road, 6th of October City', 'طريق وصلة دهشور، مدينة 6 أكتوبر', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bede5a546c2648bbbf10', u.id, 'Faculty of Medicine', 'كلية الطب', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3acb242ddaab453cbb13', u.id, f.id, 'Medicine & Surgery', 'الطب والجراحة', 'medicine-and-surgery', 'BACHELOR', 'medicine', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_396c87e4fa8b45a28157', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_fceaa319ade64b44bd02', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3536778cf46149768ec3', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a0be7b769be74b928f5e', u.id, f.id, 'Pharmaceutical Sciences (PharmD)', 'العلوم الصيدلانية (فارم دي)', 'pharmaceutical-sciences-pharmd', 'BACHELOR', 'pharmacy', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_e906d1aea4a241ca82b9', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 3, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5f05e0112dca40efad08', u.id, f.id, 'Physical Therapy', 'بكالوريوس العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2f1221c5dff24d1a8e5b', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 4, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0dac345843154360863b', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ea4c10bc35e148658bed', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 5, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_90644c513a0b4c08b5c0', u.id, f.id, 'Veterinary Medicine', 'الطب البيطري', 'veterinary-medicine', 'BACHELOR', 'veterinary', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_864d0b468a19476c85ce', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 6, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7ae7542ccae041e5badb', u.id, f.id, 'Sustainable Architecture Engineering', 'هندسة العمارة المستدامة', 'sustainable-architecture-engineering', 'BACHELOR', 'architecture', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_46d20e3242ec4ad59968', u.id, f.id, 'Construction & Infrastructure Management Engineering', 'هندسة إدارة التشييد والبنية التحتية', 'construction-and-infrastructure-management-engineering', 'BACHELOR', 'engineering', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a29c6169af54400f9887', u.id, f.id, 'Electrical Engineering & Renewable Energy', 'هندسة الكهرباء والطاقة المتجددة', 'electrical-engineering-and-renewable-energy', 'BACHELOR', 'engineering', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c2bffe073887447e885d', u.id, 'Faculty of Computers, Information & Artificial Intelligence', 'كلية الحاسبات والمعلومات والذكاء الاصطناعي', 'faculty-of-computers-information-and-artificial-intelligence', 7, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8217ea61b0c1494497dc', u.id, f.id, 'Cybersecurity & Networks', 'الأمن السيبراني والشبكات', 'cybersecurity-and-networks', 'BACHELOR', 'computer_science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3ff6bde246fb42f1ac36', u.id, f.id, 'Software Engineering', 'هندسة البرمجيات', 'software-engineering', 'BACHELOR', 'computer_science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_54401da919fd47cdb8a2', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 8, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2723e8530683488caf04', u.id, f.id, 'Biotechnology', 'التقنية الحيوية', 'biotechnology', 'BACHELOR', 'biotechnology', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_825b65dd5d3844bea6c9', u.id, f.id, 'Biochemistry & Microbiology', 'الكيمياء الحيوية والميكروبيولوجي', 'biochemistry-and-microbiology', 'BACHELOR', 'science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1d514974c4a64e6599f6', u.id, 'Faculty of Economics & Political Science', 'كلية الاقتصاد والسياسة', 'faculty-of-economics-and-political-science', 9, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_463ee89a36384b5492c7', u.id, f.id, 'Statistics & Data Science', 'الإحصاء وعلوم البيانات', 'statistics-and-data-science', 'BACHELOR', 'economics_political_science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-political-science' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_03d4558cd6d44085b944', u.id, f.id, 'FinTech Economics', 'اقتصاديات التكنولوجيا المالية', 'fintech-economics', 'BACHELOR', 'economics_political_science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-political-science' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a9dfb5c704d747c58e2f', u.id, f.id, 'Public Policy', 'السياسات العامة', 'public-policy', 'BACHELOR', 'economics_political_science', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-political-science' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_15394a6e8a63409c8358', u.id, 'Faculty of Mass Communication', 'كلية الإعلام', 'faculty-of-mass-communication', 10, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b384e953b97c421ea8e9', u.id, f.id, 'Mass Communication', 'الإعلام', 'mass-communication', 'BACHELOR', 'mass_communication', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-mass-communication' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f9bf199f50fe4fe896c7', u.id, 'Faculty of Early Childhood Education', 'كلية التربية للطفولة المبكرة', 'faculty-of-early-childhood-education', 11, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3408e240174f42b483f6', u.id, f.id, 'Special Education Teacher Preparation for Early Childhood', 'ليسانس إعداد معلمي علوم الإعاقة لمرحلة الطفولة المبكرة', 'special-education-teacher-preparation-for-early-childhood', 'BACHELOR', 'education', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-early-childhood-education' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_441d4f9579394fc7a8ca', u.id, 'Faculty of Law', 'كلية القانون', 'faculty-of-law', 12, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5ef54694dd134abbb621', u.id, f.id, 'Law', 'ليسانس الحقوق', 'law', 'BACHELOR', 'law', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-law' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_78de1049c5d64d7889a3', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 13, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6f9c2136910a427c8a04', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a999c8dc17294c859027', u.id, f.id, 'Accounting', 'المحاسبة', 'accounting', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ab247ba445b74c9680d4', u.id, f.id, 'Insurance', 'التأمين', 'insurance', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f9ea6e6ddb02438ca7ae', u.id, 'Faculty of Commerce', 'كلية التجارة', 'faculty-of-commerce', 14, now() FROM "University" u WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_368509ff871348f3b93d', u.id, f.id, 'Business Administration (English)', 'إدارة الأعمال (إنجليزي)', 'business-administration-english', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-commerce' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_070cb2b3757046c8b5cd', u.id, f.id, 'Accounting (English)', 'المحاسبة (إنجليزي)', 'accounting-english', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-commerce' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0ec8b94f8222481a8b19', u.id, f.id, 'Insurance (English)', 'التأمين (إنجليزي)', 'insurance-english', 'BACHELOR', 'business_administration', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-commerce' WHERE u.slug = 'cairo-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

INSERT INTO "University" (id, name, "nameAr", acronym, slug, type, country, "countryAr", city, "cityAr", description, "descriptionAr", "establishedYear", "websiteUrl", "logoUrl", "coverImageUrl", "addressLine", "addressLineAr", "publishedAt", "updatedAt")
VALUES ('univ_ce37287123db4fcf88cb', 'Ain Shams National University', 'جامعة عين شمس الأهلية', 'NASU', 'ain-shams-national-university', 'NATIONAL', 'Egypt', 'مصر', 'New Administrative Capital', 'العاصمة الإدارية الجديدة', 'Established by Presidential Decree No. 246 of 2025 as a non-profit national (ahleya) university. Ain Shams National University was established as a modern extension of the legacy of Ain Shams University, one of Egypt''s oldest and most prestigious universities. It combines a solid academic heritage with a contemporary vision that keeps pace with the demands of the era and the job market. The university is located in the New Administrative Capital, in the Valley of Learning & Innovation, on a modern, well-equipped campus that provides an inspiring learning environment for its founding generation of students. The university comprises four academic fields containing ten modern programs in medicine, engineering, computing, and business, designed to prepare graduates capable of leading the future and contributing to the nation''s advancement.', 'أُنشئت بقرار رئيس الجمهورية رقم 246 لسنة 2025 جامعةً أهلية غير هادفة للربح. تأسست جامعة عين شمس الأهلية لتكون امتداداً حديثاً لإرث جامعة عين شمس العريقة، إحدى أقدم وأعرق الجامعات المصرية. تجمع الجامعة بين رصيدٍ أكاديمي راسخ ورؤيةٍ معاصرة تواكب متطلّبات العصر وسوق العمل. تقع الجامعة في العاصمة الإدارية الجديدة بوادي التعلّم والابتكار، في حرمٍ جامعي حديث ومجهّز بأحدث الإمكانات، ليوفّر بيئة تعليمية مُلهمة تحتضن الجيل المؤسّس من طلابها. تضمّ الجامعة أربعة مجالات أكاديمية تحتوي على عشرة برامج حديثة في الطب والهندسة والحاسبات والأعمال، صُمّمت لإعداد خرّيجين قادرين على قيادة المستقبل والإسهام في نهضة الوطن.', 2025, NULL, '/img/universities/ain-shams-national-university/logo.png', '/img/universities/ain-shams-national-university/cover.jpg', 'Valley of Learning & Innovation, New Administrative Capital', 'وادي التعلم والابتكار، العاصمة الإدارية الجديدة', now(), now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_319201ff30374b3ea237', u.id, 'Faculty of Medicine', 'كلية الطب', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2685b7137b844d9cab03', u.id, f.id, 'Medicine & Surgery', 'بكالوريوس الطب والجراحة', 'medicine-and-surgery', 'BACHELOR', 'medicine', 'EGP', 'An integrated program that continuously develops its educational systems in line with the latest teaching and assessment methods, enabling students to acquire the competencies needed for their future roles as practicing physicians. The program combines medical education, scientific research and community service through a modern university hospital in Obour City.', 'برنامج متكامل يطوّر أنظمته التعليمية باستمرار بما يواكب أحدث أساليب التدريس والتقييم، ليكتسب الطلاب الكفاءات اللازمة لأدوارهم المستقبلية كأطباء ممارسين. يجمع البرنامج بين التعليم الطبي والبحث العلمي وخدمة المجتمع عبر مستشفى جامعي حديث في مدينة العبور.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a8057b7530024f2db340', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 1, now() FROM "University" u WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_55f5a79e431f4edc9e73', u.id, f.id, 'Digital Manufacturing & Materials Engineering', 'هندسة التصنيع الرقمي والمواد', 'digital-manufacturing-and-materials-engineering', 'BACHELOR', 'engineering', 'EGP', 'The Digital Manufacturing and Materials Engineering program integrates materials science with advanced manufacturing technologies, preparing students to meet the demands of future industries. The program emphasizes understanding the relationship between material composition, properties, and applications, enabling students to develop advanced materials for sectors such as mechanical systems, petroleum, medicine, electronics, and nanotechnology. Students acquire advanced skills in digital manufacturing, including process design, automation, smart systems, and quality assurance. The program equips graduates to innovate in material selection, optimize production systems, and enhance industrial process efficiency, aligning with global demand for sustainable and high-performance manufacturing.', 'يجمع برنامج التصنيع الرقمي وهندسة المواد بين علوم المواد والتقنيات الحديثة في التصنيع، بهدف إعداد الطلاب لمتطلبات الصناعة المستقبلية. يركّز البرنامج على فهم العلاقة بين تركيب المواد وخصائصها وتطبيقاتها، ممّا يمكّن الطلاب من تطوير مواد متقدّمة تُستخدم في قطاعات مثل الأنظمة الميكانيكية والبترول والطب والإلكترونيات وتقنيات النانو. يكتسب الطلاب مهارات متقدّمة في التصنيع الرقمي تشمل تصميم العمليات والأتمتة والأنظمة الذكية وضمان الجودة. ويُؤهّل البرنامج الخريجين للابتكار في اختيار المواد وتحسين أنظمة الإنتاج ورفع كفاءة العمليات الصناعية، لمواكبة الطلب العالمي على التصنيع الفعّال والمستدام.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ddd51d4fec1549bb9271', u.id, f.id, 'Robotics & Autonomous Systems Engineering', 'هندسة الروبوتات والأنظمة ذاتية القيادة', 'robotics-and-autonomous-systems-engineering', 'BACHELOR', 'engineering', 'EGP', 'The Robotics and Autonomous Systems Engineering program focuses on preparing engineers capable of designing and developing intelligent robotic systems that operate autonomously and make independent decisions. The program integrates multiple disciplines, including mechanical engineering, electrical and electronics engineering, control systems engineering, software engineering, and artificial intelligence. These intelligent robotic systems are utilized across diverse fields, including industrial process automation, advanced robotic manufacturing, autonomous vehicles (cars, aircraft, and submarines), smart agriculture, robotic-assisted healthcare and remote surgery, smart home assistance systems, autonomous navigation, and search-and-rescue operations. The program aims to graduate professionals capable of leading the 4th and 5th Industrial Revolutions.', 'يركّز برنامج هندسة الروبوتات والأنظمة الذاتية على إعداد مهندسين قادرين على تصميم وتطوير أنظمة روبوتية ذكية تعمل بشكل مستقل وتتخذ القرارات ذاتياً. يدمج البرنامج بين تخصصات متعدّدة تشمل الهندسة الميكانيكية، والهندسة الكهربائية والإلكترونية، وهندسة التحكّم الآلي، وعلوم البرمجيات، والذكاء الاصطناعي، ممّا يمنح الطلاب خلفية علمية متكاملة ومهارات تقنية متقدّمة. تُستخدم هذه الأنظمة في مجالات عديدة منها أتمتة العمليات الصناعية، والتصنيع المتقدّم بالروبوتات، والسيارات والطائرات والغواصات ذاتية القيادة، والزراعة الذكية، والرعاية الصحية والجراحة عن بُعد، والأنظمة الذكية للمساعدة المنزلية، والملاحة الذاتية، وعمليات البحث والإنقاذ. ويهدف البرنامج إلى تخريج كوادر مؤهّلة لقيادة الثورة الصناعية الرابعة والخامسة.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f2d9a7fdeb734f35b19f', u.id, f.id, 'Computational Architecture & Intelligent Urban Design', 'العمارة الحاسوبية والتصميم العمراني الذكي', 'computational-architecture-and-intelligent-urban-design', 'BACHELOR', 'architecture', 'EGP', 'The Digital Architecture and Intelligent Urban Design program is an integrated academic program designed to prepare architecture engineers capable of employing cutting-edge digital technologies and artificial intelligence in architectural and urban design. The program focuses on developing competencies in computational design, Building Information Modeling (BIM), Geographic Information Systems (GIS), Internet of Things (IoT), and smart city analytics. Through an interdisciplinary curriculum, students learn to apply digital design technologies, parametric modeling, generative design, and digital fabrication, while integrating virtual and augmented reality into design and construction processes. The program fosters critical and creative thinking, encouraging innovative solutions for energy efficiency and environmental sustainability.', 'برنامج هندسة العمارة الرقمية والتصميم العمراني الذكي هو برنامج متكامل يهدف إلى إعداد مهندسين معماريين يمتلكون القدرة على توظيف أحدث التقنيات الرقمية والذكاء الاصطناعي في مجالات التصميم المعماري والحضري. يركّز البرنامج على تطوير مهارات الطلاب في استخدام أدوات متقدّمة مثل التصميم الحسابي ونمذجة معلومات البناء (BIM) ونظم المعلومات الجغرافية (GIS) وإنترنت الأشياء وتحليلات المدن الذكية. من خلال منهج متعدّد التخصصات، يتعلّم الطلاب تطبيق تقنيات التصميم الرقمي والنمذجة البارامترية والتصميم التوليدي والتصنيع الرقمي، بالإضافة إلى دمج تقنيات الواقع الافتراضي والمعزّز في عمليات التصميم والإنشاء. ويعزّز البرنامج التفكير النقدي والإبداعي، ويشجّع على تبنّي حلول مبتكرة لتحقيق كفاءة الطاقة والاستدامة البيئية.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6170e7d7eba94de2a91e', u.id, f.id, 'Electronics & Artificial Intelligence Engineering', 'هندسة الإلكترونيات والذكاء الاصطناعي', 'electronics-and-artificial-intelligence-engineering', 'BACHELOR', 'engineering', 'EGP', 'The Electronics and Artificial Intelligence Engineering program is designed to meet the growing demand for skilled electronics and computer engineers in the local market. The rapid expansion of the electronics and AI sectors has outpaced the supply of qualified professionals. This program offers an interdisciplinary curriculum combining electronics engineering, computer engineering, and business knowledge. The program provides foundational knowledge across all areas of electronics and AI engineering such as software, algorithms, embedded systems, IoT, communication and network systems, digital systems, multimedia systems, and intelligent systems, alongside communication, design, development, and management skills that meet national, regional, and international labor market needs.', 'صُمّم برنامج هندسة الإلكترونيات والذكاء الاصطناعي لتلبية الطلب المتزايد على مهندسي الإلكترونيات والحاسوب في السوق المحلي، المتخصصين في تطبيقات هندسة الإلكترونيات والذكاء الاصطناعي. يشهد القطاعان نمواً متسارعاً يفوق العرض من المواهب الجديدة. ويقدّم البرنامج مزيجاً متعدّد التخصصات من هندسة الإلكترونيات وهندسة الحاسوب بالإضافة إلى المعرفة التجارية. يوفّر البرنامج المعرفة الأساسية في جميع مجالات هندسة الإلكترونيات والذكاء الاصطناعي مثل البرمجيات والخوارزميات والنظم المدمجة وإنترنت الأشياء ونظم الاتصالات والشبكات والنظم الرقمية والنظم متعدّدة الوسائط والنظم الذكية، إلى جانب مهارات الاتصال والتصميم والتطوير والإدارة، بما يلبّي متطلبات سوق العمل الوطنية والإقليمية والدولية.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_265cde8a92d543e7b387', u.id, f.id, 'Civil Engineering & Environmental Informatics', 'الهندسة المدنية والمعلوماتية البيئية', 'civil-engineering-and-environmental-informatics', 'BACHELOR', 'engineering', 'EGP', 'The Civil Engineering and Environmental Informatics program focuses on the scientific assessment and development of engineering solutions for civil engineering challenges with environmental impacts. These include safe drinking water, wastewater treatment, solid and hazardous waste disposal, air and noise pollution, human and environmental health risk management, and pollution prevention. Given the complexity of these challenges and the vast amounts of associated data, informatics becomes essential. The program aims to prepare civil and environmental engineers capable of utilizing advanced modern technologies while developing the tools to predict and better manage environmental needs, emphasizing clean environments and green infrastructure planning in alignment with smart city concepts. Graduates will develop critical analytical, decision-making, and data modeling skills using appropriate tools, including artificial intelligence.', 'يغطّي برنامج الهندسة المدنية والمعلوماتية البيئية التقييم العلمي وتطوير الحلول الهندسية للمشكلات الخاصة بالهندسة المدنية التي تؤثّر على البيئة. وتشمل هذه المشكلات مياه الشرب الآمنة، ومعالجة مياه الصرف الصحي، والتخلّص من النفايات الصلبة والخطرة، وتلوّث الهواء الخارجي والداخلي والضوضاء الناتجة من وسائل النقل، وإدارة مخاطر الصحة البشرية والبيئية، والوقاية من التلوّث. ونظراً لتعقيد هذه المشكلات والكمّ الهائل من البيانات المتصلة بها، تصبح المعلوماتية ضرورية لتحويل البيانات الضخمة المعقّدة إلى حقائق قابلة للاستخدام. يهدف البرنامج إلى إعداد مهندسين مدنيين وبيئيين قادرين على استخدام التقنيات الحديثة والمتقدّمة، إلى جانب تطوير الأدوات اللازمة للتنبؤ بالاحتياجات البيئية والتعامل معها، من أجل توفير بيئات نظيفة والتخطيط لبنية تحتية خضراء تتوافق مع مفاهيم المدن الذكية. وسيطوّر الخريجون مهارات التحليل واتخاذ القرار ونمذجة البيانات باستخدام الأدوات المناسبة بما فيها الذكاء الاصطناعي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_93d2aa7cc57f4779b668', u.id, 'Faculty of Computers, Information & Artificial Intelligence', 'كلية الحاسبات والمعلومات والذكاء الاصطناعي', 'faculty-of-computers-information-and-artificial-intelligence', 2, now() FROM "University" u WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a47b36a8a4dc44dd895e', u.id, f.id, 'Data Science & Analytics', 'علوم البيانات والتحليلات', 'data-science-and-analytics', 'BACHELOR', 'computer_science', 'EGP', 'The modern world operates on a massive amount of data - from smartphones to smart homes. Data science is the field that exploits data to extract insights, solve real-world problems, and drive innovation. This program provides students with a foundation in the essential disciplines of computer science, statistics, and mathematics relevant to the analysis and processing of large, complex datasets. The program goes beyond conventional statistical analysis, addressing the full data lifecycle: from specification, acquisition, and cleaning, to storage, modeling, visualization, and data-informed decision-making.', 'يعتمد العالم الحديث على كمية هائلة من البيانات، من الهواتف الذكية إلى المنازل الذكية. علوم البيانات هو المجال الذي يستغلّ البيانات لاستخلاص الرؤى وحلّ مشاكل العالم الحقيقي ودفع الابتكار. يوفّر هذا البرنامج للطلاب أساساً في التخصصات الأساسية لعلوم الحاسب والإحصاء والرياضيات ذات الصلة بتحليل ومعالجة مجموعات البيانات الكبيرة والمعقّدة، ويتجاوز التحليل الإحصائي التقليدي ليتناول دورة حياة البيانات الكاملة، من التحديد والاكتساب والتنظيف، إلى التخزين والنمذجة والتصوّر واتخاذ القرارات المستندة إلى البيانات.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ca4ac748d89d4ccda721', u.id, f.id, 'Computer Science & Artificial Intelligence', 'علوم الحاسب والذكاء الاصطناعي', 'computer-science-and-artificial-intelligence', 'BACHELOR', 'computer_science', 'EGP', 'BSc Computer Science and Artificial Intelligence contains broad coverage of all major computer science topics as well as specialist modules in artificial intelligence. This foundation prepares graduates to be effective contributors to the field, capable of addressing complex challenges and driving technological innovation. By combining theoretical knowledge with practical skills and ethical considerations, graduates are well-equipped to contribute to the advancement of AI and its applications in various fields.', 'يتضمّن برنامج بكالوريوس علوم الحاسوب والذكاء الاصطناعي تغطيةً شاملةً لجميع مواضيع علوم الحاسب الرئيسية، بالإضافة إلى وحداتٍ متخصصة في الذكاء الاصطناعي. يُهيّئ هذا البرنامج الخريجين ليكونوا مساهمين فاعلين في مجال علوم الحاسب والذكاء الاصطناعي، قادرين على مواجهة التحديات المعقّدة ودفع عجلة الابتكار التكنولوجي. ومن خلال الجمع بين المعرفة النظرية والمهارات العملية والاعتبارات الأخلاقية، يكون الخريجون مؤهّلين تأهيلاً عالياً للمساهمة في تطوير الذكاء الاصطناعي وتطبيقاته في مختلف المجالات.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_476d34df030b467dbd28', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 3, now() FROM "University" u WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2eca2068f06844828211', u.id, f.id, 'Financial Technology', 'التكنولوجيا المالية', 'financial-technology', 'BACHELOR', 'business_administration', 'EGP', 'The Financial Technology (FinTech) Program is designed to equip students with the essential knowledge and practical skills to excel in the rapidly evolving financial industry. This program combines core finance principles with cutting-edge technologies, enabling students to develop innovative solutions for financial challenges. Primary areas of study include data analytics, machine learning, blockchain technology, cryptocurrency, algorithmic trading, and fintech innovation. Through a blend of theoretical coursework and hands-on projects, students will gain proficiency in programming languages such as Python and R, allowing them to apply their learning to real-world financial scenarios. The program aims to provide a comprehensive understanding of financial markets and innovative technologies, develop expertise in applying advanced technologies to solve financial problems, and foster critical thinking and ethical decision-making.', 'صُمّم برنامج التكنولوجيا المالية لتزويد الطلاب بالمعرفة الأساسية والمهارات العملية اللازمة للتفوّق في القطاع المالي سريع التطوّر. يجمع هذا البرنامج بين مبادئ التمويل الأساسية والتقنيات المتطوّرة، ممّا يُمكّن الطلاب من تطوير حلول مبتكرة للتحديات المالية. وتشمل مجالات الدراسة الرئيسية تحليلات البيانات، والتعلّم الآلي، وتقنية البلوك تشين، والعملات المشفّرة، والتداول الخوارزمي، وابتكارات التكنولوجيا المالية. ومن خلال مزيج من المقررات الدراسية النظرية والمشاريع العملية، سيكتسب الطلاب إتقاناً في لغات البرمجة مثل بايثون وR، ممّا يُمكّنهم من تطبيق ما تعلّموه على السيناريوهات المالية الواقعية. يهدف البرنامج إلى توفير فهم شامل للأسواق المالية والتقنيات المبتكرة، وتطوير الخبرة في تطبيق التقنيات المتقدّمة لحلّ المشكلات المالية، وتعزيز التفكير النقدي واتخاذ القرارات الأخلاقية.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d6b64a0a42a14a9ea0e7', u.id, f.id, 'Digital Marketing', 'التسويق الرقمي', 'digital-marketing', 'BACHELOR', 'business_administration', 'EGP', 'The Digital Marketing Program is a four-year undergraduate program designed to prepare students for leadership roles in the evolving digital economy. The program blends foundational business education with advanced digital marketing competencies, equipping students with the skills needed to thrive in data-driven, tech-enabled environments. Core areas of study include digital strategy, content creation, marketing analytics, e-commerce, online consumer behavior, and the application of artificial intelligence and machine learning in marketing. Supporting disciplines such as programming, design, and data interpretation are integrated to foster both technical proficiency and creative problem-solving.', 'يُعدّ برنامج التسويق الرقمي برنامجاً أكاديمياً متكاملاً يمتد لأربع سنوات، ويهدف إلى إعداد الكوادر المؤهّلة لتولّي مناصب قيادية في بيئة الاقتصاد الرقمي الحديث. يوفّر البرنامج مزيجاً متوازناً بين الأسس العلمية للإدارة والأعمال، والتخصصات المتقدّمة في مجالات التسويق الرقمي، بما يُمكّن الطلاب من اكتساب المهارات والمعارف الضرورية للعمل بكفاءة في مجالات قائمة على البيانات والتقنيات الحديثة. تشمل مجالات الدراسة الرئيسية الاستراتيجية الرقمية، وإنشاء المحتوى، وتحليلات التسويق، والتجارة الإلكترونية، وسلوك المستهلك الرقمي، بالإضافة إلى تطبيقات الذكاء الاصطناعي وتعلّم الآلة في العمليات التسويقية. ويُعزّز البرنامج هذا الإطار المعرفي من خلال إدماج مقررات ذات صلة وثيقة مثل البرمجة والتصميم وتحليل البيانات.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'ain-shams-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;


-- ===== prisma/seed/cairo-ain-shams-national-fees-2026-10-13.sql
-- 2026/2027 yearly fees for Cairo National and Ain Shams National universities,
-- per faculty, from the Safir Uni fee infographics supplied by the client
-- (2026-10-13). Not listed there, so left empty: Cairo National's Faculty of
-- Mass Communication and its English-taught Faculty of Commerce programs.
-- Each program's description gets the infographics' note that administrative
-- and service fees may be added (appended once; safe to re-run).


UPDATE "Program" p SET "tuitionFee" = 210529, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-medicine';

UPDATE "Program" p SET "tuitionFee" = 117487, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-engineering';

UPDATE "Program" p SET "tuitionFee" = 115544, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence';

UPDATE "Program" p SET "tuitionFee" = 87604, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-business';

UPDATE "Program" p SET "tuitionFee" = 170000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-medicine';

UPDATE "Program" p SET "tuitionFee" = 137000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-dentistry';

UPDATE "Program" p SET "tuitionFee" = 120000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-pharmacy';

UPDATE "Program" p SET "tuitionFee" = 120000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-physical-therapy';

UPDATE "Program" p SET "tuitionFee" = 88000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-engineering';

UPDATE "Program" p SET "tuitionFee" = 88000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence';

UPDATE "Program" p SET "tuitionFee" = 85000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-veterinary-medicine';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-nursing';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-science';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-business';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-economics-and-political-science';

UPDATE "Program" p SET "tuitionFee" = 55000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-law';

UPDATE "Program" p SET "tuitionFee" = 33000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-early-childhood-education';

-- Ain Shams National's temporary home, per its fee infographic.
UPDATE "University" SET description = description || ' Until its campus opens, teaching takes place at Ain Shams University''s Abbassia campus in Cairo.', "descriptionAr" = "descriptionAr" || ' وتجري الدراسة مؤقتًا في مقر جامعة عين شمس بالعباسية في القاهرة لحين افتتاح حرمها الجامعي.', "updatedAt" = now()
WHERE slug = 'ain-shams-national-university' AND position('Until its campus opens, teaching takes place at Ain Shams University''s Abbassia campus in Cairo.' in description) = 0;


-- ===== prisma/seed/cairo-national-mass-comm-commerce-fees-2026-10-13.sql
-- Cairo National University: fees for the two faculties missing from the
-- 2026/2027 fee infographic (2026-10-13).
--
-- Mass Communication: EGP 50,000 in 2025/2026 (Al-Ahram, 13 Jul 2025), and the
-- university announced a 10% increase for new students in 2026/2027 (Youm7,
-- 22 Apr 2026). Every other faculty moved exactly that way (rounded down, e.g.
-- Law 50,000 -> 55,000), so 55,000.
--
-- Commerce (English-taught programs): no separate English-track fee has been
-- published; every list gives a single business faculty fee, 66,000 for
-- 2026/2027 (Al-Watan, 4 Aug 2026; matches the infographic).


UPDATE "Program" p SET "tuitionFee" = 55000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = 'Annual fee for 2026/2027, based on the published 2025/2026 fee (EGP 50,000) plus the 10% increase the university announced for new students; administrative and service fees may be added under the university''s regulations.',
  "descriptionAr" = 'المصروفات السنوية للعام الجامعي 2026/2027، محسوبة من مصروفات 2025/2026 المعلنة (50 ألف جنيه) مع زيادة 10% التي أعلنتها الجامعة للطلاب الجدد، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.'
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-mass-communication';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = 'Annual fee for 2026/2027: the university''s published business faculty fee, as no separate fee has been announced for the English-taught programs; administrative and service fees may be added under the university''s regulations.',
  "descriptionAr" = 'المصروفات السنوية للعام الجامعي 2026/2027: مصروفات كلية الأعمال المعلنة، إذ لم تُعلن مصروفات منفصلة للبرامج باللغة الإنجليزية، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.'
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-commerce';


-- ===== /c/Users/seif_/AppData/Local/Temp/claude/S--DEV-proj-unilink-workspace/daea277d-7872-4e51-8d10-9dd75b4c7674/scratchpad/recovery/work/04b.sql
-- University and faculty fields as of the 2026-10-13 catalogue snapshot,
-- plus homepage flags.

UPDATE "University" SET name = 'German University in Cairo', "nameAr" = 'الجامعة الألمانية بالقاهرة', acronym = 'GUC', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/german-university-in-cairo-guc/logo.png', city = 'New Cairo', "cityAr" = 'القاهرة الجديدة' WHERE slug = 'german-university-in-cairo-guc';
UPDATE "University" SET name = 'Misr University for Science and Technology', "nameAr" = 'جامعة مصر للعلوم والتكنولوجيا', acronym = 'MUST', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/misr-university-for-science-and-technology/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'misr-university-for-science-and-technology';
UPDATE "University" SET name = 'Nile University', "nameAr" = 'جامعة النيل', acronym = 'NU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/nile-university/logo.png', city = 'Sheikh Zayed City', "cityAr" = 'مدينة الشيخ زايد' WHERE slug = 'nile-university';
UPDATE "University" SET name = 'Badr University in Cairo', "nameAr" = 'جامعة بدر بالقاهرة', acronym = 'BUC', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Badr City', "cityAr" = 'مدينة بدر' WHERE slug = 'badr-university-in-cairo';
UPDATE "University" SET name = 'The British University in Egypt', "nameAr" = 'الجامعة البريطانية في مصر', acronym = 'BUE', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/british-university-in-egypt/logo.png', city = 'El Shorouk City', "cityAr" = 'مدينة الشروق' WHERE slug = 'british-university-in-egypt';
UPDATE "University" SET name = 'Ahram Canadian University', "nameAr" = 'جامعة الأهرام الكندية', acronym = 'ACU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'ahram-canadian-university';
UPDATE "University" SET name = 'Ain Shams National University', "nameAr" = 'جامعة عين شمس الأهلية', acronym = 'NASU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/ain-shams-national-university/logo.png', city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'ain-shams-national-university';
UPDATE "University" SET name = 'Al Hayah University in Cairo', "nameAr" = 'جامعة الحياة بالقاهرة', acronym = 'AHUC', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Cairo', "cityAr" = 'القاهرة الجديدة' WHERE slug = 'al-hayah-university-in-cairo';
UPDATE "University" SET name = 'Al Salam University', "nameAr" = 'جامعة السلام', acronym = 'SalamU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Assiut', "cityAr" = 'أسيوط' WHERE slug = 'al-salam-university';
UPDATE "University" SET name = 'Arab Academy for Science, Technology & Maritime Transport', "nameAr" = 'الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري', acronym = 'AASTMT', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Alexandria', "cityAr" = 'الإسكندرية' WHERE slug = 'arab-academy-for-science-technology-and-maritime-transport';
UPDATE "University" SET name = 'Badr University in Assiut', "nameAr" = 'جامعة بدر بأسيوط', acronym = 'BAU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Assiut', "cityAr" = 'أسيوط' WHERE slug = 'badr-university-in-assiut';
UPDATE "University" SET name = 'Badya University', "nameAr" = 'جامعة باديا', acronym = 'BU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'badya-university';
UPDATE "University" SET name = 'Benha National University', "nameAr" = 'جامعة بنها الأهلية', acronym = 'BNU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/benha-national-university/logo.png', city = 'Obour City', "cityAr" = 'مدينة العبور' WHERE slug = 'benha-national-university';
UPDATE "University" SET name = 'Cairo National University', "nameAr" = 'جامعة القاهرة الأهلية', acronym = 'CNU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/cairo-national-university/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'cairo-national-university';
UPDATE "University" SET name = 'Canadian International College', "nameAr" = 'الكلية الكندية الدولية', acronym = 'CIC', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/canadian-international-college/logo.png', city = 'Sheikh Zayed City', "cityAr" = 'مدينة الشيخ زايد' WHERE slug = 'canadian-international-college';
UPDATE "University" SET name = 'City University', "nameAr" = 'جامعة المدينة بالقاهرة', acronym = 'CUC', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Badr City', "cityAr" = 'مدينة بدر' WHERE slug = 'city-university';
UPDATE "University" SET name = 'Coventry University Egypt', "nameAr" = 'جامعة كوفنتري مصر', acronym = 'CUK', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'coventry-university-egypt';
UPDATE "University" SET name = 'Delta University for Science and Technology', "nameAr" = 'جامعة الدلتا للعلوم والتكنولوجيا', acronym = 'DU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/delta-university-for-science-and-technology/logo.png', city = 'Gamasa', "cityAr" = 'جمصة' WHERE slug = 'delta-university-for-science-and-technology';
UPDATE "University" SET name = 'Deraya University', "nameAr" = 'جامعة دراية', acronym = 'DU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/deraya-university/logo.png', city = 'Minya', "cityAr" = 'المنيا' WHERE slug = 'deraya-university';
UPDATE "University" SET name = 'Egypt-Japan University of Science and Technology', "nameAr" = 'الجامعة المصرية اليابانية للعلوم والتكنولوجيا', acronym = 'E-JUST', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/egypt-japan-university-of-science-and-technology/logo.png', city = 'New Borg El Arab', "cityAr" = 'برج العرب الجديدة' WHERE slug = 'egypt-japan-university-of-science-and-technology';
UPDATE "University" SET name = 'Egyptian Chinese University', "nameAr" = 'الجامعة المصرية الصينية', acronym = 'ECU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/egyptian-chinese-university/logo.png', city = 'Cairo', "cityAr" = 'القاهرة' WHERE slug = 'egyptian-chinese-university';
UPDATE "University" SET name = 'Egyptian Informatics University', "nameAr" = 'الجامعة المصرية للمعلوماتية', acronym = 'EIU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/egyptian-informatics-university/logo.png', city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'egyptian-informatics-university';
UPDATE "University" SET name = 'Egyptian Russian University', "nameAr" = 'الجامعة المصرية الروسية', acronym = 'ERU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/egyptian-russian-university/logo.png', city = 'Badr City', "cityAr" = 'مدينة بدر' WHERE slug = 'egyptian-russian-university';
UPDATE "University" SET name = 'Future University in Egypt', "nameAr" = 'جامعة المستقبل بمصر', acronym = 'FUE', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Cairo', "cityAr" = 'القاهرة الجديدة' WHERE slug = 'future-university-in-egypt';
UPDATE "University" SET name = 'Galala University', "nameAr" = 'جامعة الجلالة', acronym = 'Galala', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/galala-university/logo.png', city = 'Ain Sokhna', "cityAr" = 'العين السخنة' WHERE slug = 'galala-university';
UPDATE "University" SET name = 'German International University', "nameAr" = 'الجامعة الألمانية الدولية', acronym = 'GIU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/german-international-university/logo.png', city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'german-international-university';
UPDATE "University" SET name = 'Heliopolis University for Sustainable Development', "nameAr" = 'جامعة هليوبوليس للتنمية المستدامة', acronym = 'HU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/heliopolis-university-for-sustainable-development/logo.png', city = 'El Salam City', "cityAr" = 'مدينة السلام' WHERE slug = 'heliopolis-university-for-sustainable-development';
UPDATE "University" SET name = 'Hertfordshire University Egypt', "nameAr" = 'جامعة هيرتفوردشاير مصر', acronym = 'UH-GAF', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/hertfordshire-university-egypt/logo.png', city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'hertfordshire-university-egypt';
UPDATE "University" SET name = 'Horus University in Egypt', "nameAr" = 'جامعة حورس في مصر', acronym = 'HUE', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/horus-university-in-egypt/logo.png', city = 'New Damietta', "cityAr" = 'دمياط الجديدة' WHERE slug = 'horus-university-in-egypt';
UPDATE "University" SET name = 'Innovation University', "nameAr" = 'جامعة الابتكار', acronym = 'IU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = '10th of Ramadan City', "cityAr" = 'مدينة العاشر من رمضان' WHERE slug = 'innovation-university';
UPDATE "University" SET name = 'Kayan University', "nameAr" = 'جامعة كيان', acronym = NULL, type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'kayan-university';
UPDATE "University" SET name = 'King Salman International University', "nameAr" = 'جامعة الملك سلمان الدولية', acronym = 'KSIU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/king-salman-international-university/logo.png', city = 'South Sinai', "cityAr" = 'جنوب سيناء' WHERE slug = 'king-salman-international-university';
UPDATE "University" SET name = 'Lotus University', "nameAr" = 'جامعة اللوتس', acronym = 'LUM', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Minya', "cityAr" = 'المنيا الجديدة' WHERE slug = 'lotus-university';
UPDATE "University" SET name = 'May University in Cairo', "nameAr" = 'جامعة مايو بالقاهرة', acronym = 'MUC', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = '15th of May City', "cityAr" = 'مدينة 15 مايو' WHERE slug = 'may-university-in-cairo';
UPDATE "University" SET name = 'Memphis University', "nameAr" = 'جامعة ممفيس', acronym = 'MU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'memphis-university';
UPDATE "University" SET name = 'Merit University', "nameAr" = 'جامعة ميريت', acronym = 'MUE', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Sohag', "cityAr" = 'سوهاج' WHERE slug = 'merit-university';
UPDATE "University" SET name = 'Misr International University', "nameAr" = 'جامعة مصر الدولية', acronym = 'MIU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/misr-international-university-miu/logo.png', city = 'Obour City', "cityAr" = 'مدينة العبور' WHERE slug = 'misr-international-university-miu';
UPDATE "University" SET name = 'Modern University for Technology & Information', "nameAr" = 'الجامعة الحديثة للتكنولوجيا والمعلومات', acronym = 'MTI', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/modern-university-for-technology-and-information/logo.png', city = 'Mokattam', "cityAr" = 'المقطم' WHERE slug = 'modern-university-for-technology-and-information';
UPDATE "University" SET name = 'MSA University', "nameAr" = 'جامعة العلوم الحديثة والآداب (MSA)', acronym = 'MSA', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/msa-university/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'msa-university';
UPDATE "University" SET name = 'Nahda University', "nameAr" = 'جامعة النهضة', acronym = 'NUB', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/nahda-university/logo.png', city = 'Beni Suef', "cityAr" = 'بني سويف' WHERE slug = 'nahda-university';
UPDATE "University" SET name = 'New Alamein International University', "nameAr" = 'جامعة العلمين الجديدة الدولية', acronym = 'NAU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/new-alamein-international-university/logo.png', city = 'New Alamein', "cityAr" = 'العلمين الجديدة' WHERE slug = 'new-alamein-international-university';
UPDATE "University" SET name = 'New Giza University', "nameAr" = 'جامعة نيو جيزة', acronym = 'NGU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/new-giza-university/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'new-giza-university';
UPDATE "University" SET name = 'New Mansoura University', "nameAr" = 'جامعة المنصورة الجديدة', acronym = 'NMU', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/new-mansoura-university/logo.png', city = 'New Mansoura', "cityAr" = 'المنصورة الجديدة' WHERE slug = 'new-mansoura-university';
UPDATE "University" SET name = 'Nile Valley University', "nameAr" = 'جامعة وادي النيل', acronym = 'NVU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Fayoum', "cityAr" = 'الفيوم' WHERE slug = 'nile-valley-university';
UPDATE "University" SET name = 'Obour University of Science & Technology', "nameAr" = 'جامعة العبور للعلوم والتكنولوجيا', acronym = 'OUST', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Obour City', "cityAr" = 'مدينة العبور' WHERE slug = 'obour-university-of-science-and-technology';
UPDATE "University" SET name = 'October 6 University', "nameAr" = 'جامعة 6 أكتوبر', acronym = 'O6U', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/october-6-university/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'october-6-university';
UPDATE "University" SET name = 'Pharos University in Alexandria', "nameAr" = 'جامعة فاروس بالإسكندرية', acronym = 'PUA', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/pharos-university-in-alexandria/logo.png', city = 'Alexandria', "cityAr" = 'الإسكندرية' WHERE slug = 'pharos-university-in-alexandria';
UPDATE "University" SET name = 'Rashid University', "nameAr" = 'جامعة رشيد', acronym = 'RU', type = 'NATIONAL'::"UniversityType", "logoUrl" = NULL, city = 'New Rashid', "cityAr" = 'رشيد الجديدة' WHERE slug = 'rashid-university';
UPDATE "University" SET name = 'Ryada University for Science and Technology', "nameAr" = 'جامعة الريادة للعلوم والتكنولوجيا', acronym = 'RST', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Sadat City', "cityAr" = 'مدينة السادات' WHERE slug = 'ryada-university-for-science-and-technology';
UPDATE "University" SET name = 'Sinai University', "nameAr" = 'جامعة سيناء', acronym = 'SU', type = 'PRIVATE'::"UniversityType", "logoUrl" = '/img/universities/sinai-university/logo.png', city = 'Arish', "cityAr" = 'العريش' WHERE slug = 'sinai-university';
UPDATE "University" SET name = 'Sphinx University', "nameAr" = 'جامعة سفنكس', acronym = 'SU', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Assiut', "cityAr" = 'أسيوط الجديدة' WHERE slug = 'sphinx-university';
UPDATE "University" SET name = 'Université Française d''Égypte', "nameAr" = 'الجامعة الفرنسية في مصر', acronym = 'UFE', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/universite-francaise-degypte/logo.png', city = 'El Shorouk City', "cityAr" = 'مدينة الشروق' WHERE slug = 'universite-francaise-degypte';
UPDATE "University" SET name = 'University of East Capital', "nameAr" = 'جامعة شرق العاصمة', acronym = 'UEC', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'Cairo', "cityAr" = 'القاهرة' WHERE slug = 'university-of-east-capital';
UPDATE "University" SET name = 'University of London Egypt', "nameAr" = 'جامعة لندن مصر', acronym = 'UoL', type = 'PRIVATE'::"UniversityType", "logoUrl" = NULL, city = 'New Administrative Capital', "cityAr" = 'العاصمة الإدارية الجديدة' WHERE slug = 'university-of-london-egypt';
UPDATE "University" SET name = 'Zewail City of Science, Technology and Innovation', "nameAr" = 'مدينة زويل للعلوم والتكنولوجيا والابتكار', acronym = 'Zewail', type = 'NATIONAL'::"UniversityType", "logoUrl" = '/img/universities/zewail-city-of-science-technology-and-innovation/logo.png', city = '6th of October City', "cityAr" = 'مدينة 6 أكتوبر' WHERE slug = 'zewail-city-of-science-technology-and-innovation';
UPDATE "Faculty" SET name = 'Faculty of Informatics & Computer Science (ICS)', "nameAr" = 'كلية المعلوماتية وعلوم الحاسب' WHERE id = 'fac_1ca5d89df928436aae3c';
UPDATE "Faculty" SET name = 'Faculty of Business Administration, Economics & Political Science (BAEPS)', "nameAr" = 'كلية إدارة الأعمال والاقتصاد والعلوم السياسية' WHERE id = 'fac_841260f9c98140baa764';
UPDATE "Faculty" SET name = 'Faculty of Communication & Mass Media', "nameAr" = 'كلية الاتصال والإعلام' WHERE id = 'fac_d598f7585bbb47e8bc6a';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_3a1fe6acb2f64e8e8056';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_d1ff886342ee431e9398';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_a73e8533b9d94dbb8016';
UPDATE "Faculty" SET name = 'Faculty of Physiotherapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_e273b09766c14f8781fd';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_0d42f93868d046ccac24';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_b0a50087b90541e78178';
UPDATE "Faculty" SET name = 'Faculty of Engineering & Technology', "nameAr" = 'كلية الهندسة والتكنولوجيا' WHERE id = 'fac_0ca2e0d914be437fa621';
UPDATE "Faculty" SET name = 'Faculty of Economics & Political Science', "nameAr" = 'كلية الاقتصاد والعلوم السياسية' WHERE id = 'fac_8ece9ed3d90249959e0b';
UPDATE "Faculty" SET name = 'Faculty of Computers & Information Technology', "nameAr" = 'كلية الحاسبات وتكنولوجيا المعلومات' WHERE id = 'fac_2cdcc2a03e7d477080d6';
UPDATE "Faculty" SET name = 'Faculty of Commerce & Business Administration', "nameAr" = 'كلية التجارة وإدارة الأعمال' WHERE id = 'fac_e65807a1dc3f4f6aa5a1';
UPDATE "Faculty" SET name = 'Faculty of Media Engineering & Technology', "nameAr" = 'كلية هندسة الإعلام والتكنولوجيا' WHERE id = 'fac_7a5e22ed8b694bb58009';
UPDATE "Faculty" SET name = 'Faculty of Information Engineering & Technology', "nameAr" = 'كلية هندسة المعلومات والتكنولوجيا' WHERE id = 'fac_b611b71fb3d74e6b8c70';
UPDATE "Faculty" SET name = 'Faculty of Engineering & Materials Science', "nameAr" = 'كلية الهندسة وعلوم المواد' WHERE id = 'fac_6a07448d442c444bbdf8';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy & Biotechnology', "nameAr" = 'كلية الصيدلة والتكنولوجيا الحيوية' WHERE id = 'fac_343a7e6f96eb4a13b0eb';
UPDATE "Faculty" SET name = 'Faculty of Management Technology', "nameAr" = 'كلية تكنولوجيا الإدارة' WHERE id = 'fac_0af4116d1324484bbff3';
UPDATE "Faculty" SET name = 'Faculty of Applied Sciences & Arts', "nameAr" = 'كلية العلوم والفنون التطبيقية' WHERE id = 'fac_b48fef60081c4d67b857';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_4e8b1dc8312f4d618920';
UPDATE "Faculty" SET name = 'Faculty of Law & Legal Studies', "nameAr" = 'كلية الحقوق والدراسات القانونية' WHERE id = 'fac_5f4d484d09c94f0bb494';
UPDATE "Faculty" SET name = 'Faculty of Al-Alsun (Applied Linguistics)', "nameAr" = 'كلية الألسن (اللغويات التطبيقية)' WHERE id = 'fac_19f114cb7baa473e8573';
UPDATE "Faculty" SET name = 'Faculty of Business Administration & International Trade', "nameAr" = 'كلية إدارة الأعمال والتجارة الدولية' WHERE id = 'fac_817c4ca968364453806a';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_cf3959ca22aa441d93bc';
UPDATE "Faculty" SET name = 'Faculty of Engineering Sciences & Arts', "nameAr" = 'كلية العلوم والفنون الهندسية' WHERE id = 'fac_cd11d4800df34b43baee';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_1ba1c99c2dbd47938add';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_8f9de7e3649f4d3c966c';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_3669ccd4237d4276a8b6';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_8c79e09a37134540be78';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_dd32b5803cd44f279c51';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_189a8495c9124e748994';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Science Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_953393a8e44944209c45';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_64bb1008f69b421ea39c';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_ae2fe97e4592407e990d';
UPDATE "Faculty" SET name = 'School of Applied Arts', "nameAr" = 'مدرسة الفنون التطبيقية' WHERE id = 'fac_e452a21e3da048b89ff6';
UPDATE "Faculty" SET name = 'School of Business and Economics', "nameAr" = 'مدرسة إدارة الأعمال والاقتصاد' WHERE id = 'fac_55f3f49727ee4eda99ef';
UPDATE "Faculty" SET name = 'School of Engineering & Technology', "nameAr" = 'مدرسة الهندسة والتكنولوجيا' WHERE id = 'fac_52a01a91c6644ace9dd3';
UPDATE "Faculty" SET name = 'Filmmaking and Performing Arts', "nameAr" = 'صناعة السينما والفنون الأدائية' WHERE id = 'fac_c7ca4e77818345e0a6df';
UPDATE "Faculty" SET name = 'School of Linguistics & Translation', "nameAr" = 'مدرسة اللغويات والترجمة' WHERE id = 'fac_68453caef30d4bac9d8f';
UPDATE "Faculty" SET name = 'School of Medicine', "nameAr" = 'مدرسة الطب' WHERE id = 'fac_7a896df10e9f4a20b12d';
UPDATE "Faculty" SET name = 'Oral and Dental Medicine', "nameAr" = 'طب الفم والأسنان' WHERE id = 'fac_3b96e6237a1244e992e3';
UPDATE "Faculty" SET name = 'School of Nursing', "nameAr" = 'مدرسة التمريض' WHERE id = 'fac_2d6ad758783944b3bad3';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_e8b1605e9a11494f9c0e';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_b63ac2889bf54f96b935';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_e7e73968d70b404c9b04';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_a77a992cc7c248c7b9d1';
UPDATE "Faculty" SET name = 'Faculty of Artificial Intelligence', "nameAr" = 'كلية الذكاء الاصطناعي' WHERE id = 'fac_5195b072ed914cb2becf';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_8ca147ac19b442e9aba6';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_c743960658234c09a803';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_d15ae06ab0c44b2a8fe3';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_cd781d2a8f2a44de9283';
UPDATE "Faculty" SET name = 'Faculty of Arts', "nameAr" = 'كلية الآداب' WHERE id = 'fac_e71e00b9003e4a5d9417';
UPDATE "Faculty" SET name = 'Faculty of Energy Engineering', "nameAr" = 'كلية هندسة الطاقة' WHERE id = 'fac_7ae194f5892748a0b3dd';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية الحقوق' WHERE id = 'fac_bd5fbc1c64b94724bb0b';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_532b1cd6d8da4a2d89ef';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_d1396c19fd0f416ca3e6';
UPDATE "Faculty" SET name = 'Faculty of Artificial Intelligence', "nameAr" = 'كلية الذكاء الاصطناعي' WHERE id = 'fac_2bbf2df9723c48028b50';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_e640744ae8934ff8822b';
UPDATE "Faculty" SET name = 'Faculty of Management, Economics & Business Technology', "nameAr" = 'كلية الإدارة والاقتصاد وتكنولوجيا الأعمال' WHERE id = 'fac_c37c6fb02b4443048790';
UPDATE "Faculty" SET name = 'Faculty of Fine Arts', "nameAr" = 'كلية الفنون الجميلة' WHERE id = 'fac_cb6ffab2d8dd42b4835a';
UPDATE "Faculty" SET name = 'Faculty of Applied Arts', "nameAr" = 'كلية الفنون التطبيقية' WHERE id = 'fac_a5e55ebc0e5f4855a10e';
UPDATE "Faculty" SET name = 'Faculty of Al-Alsun & Technical Languages', "nameAr" = 'كلية الألسن واللغات التقنية' WHERE id = 'fac_f6b96d207bba4a349a26';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_9b88389058b94bbbb144';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_d9a51ba2faf5497fba2c';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_3ba8f10b0f7341c98a42';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_711e6062bc4e41e78a63';
UPDATE "Faculty" SET name = 'Faculty of Information Technology', "nameAr" = 'كلية تكنولوجيا المعلومات' WHERE id = 'fac_2d0c130b629849ca90af';
UPDATE "Faculty" SET name = 'Faculty of Business & Economics', "nameAr" = 'كلية إدارة الأعمال والاقتصاد' WHERE id = 'fac_28038a4278784dd5a71e';
UPDATE "Faculty" SET name = 'Faculty of Mass Media & Communication Technology', "nameAr" = 'كلية الإعلام وتكنولوجيا الاتصال' WHERE id = 'fac_a9df19601c4e4d7dad73';
UPDATE "Faculty" SET name = 'Faculty of Archaeology & Tourism', "nameAr" = 'كلية الآثار والسياحة' WHERE id = 'fac_fbdb4143328a44c1a7db';
UPDATE "Faculty" SET name = 'Faculty of Foreign Languages & Translation', "nameAr" = 'كلية اللغات الأجنبية والترجمة' WHERE id = 'fac_1453795bb5414232b602';
UPDATE "Faculty" SET name = 'Faculty of Special Education', "nameAr" = 'كلية التربية الخاصة' WHERE id = 'fac_3ef7c1dab8184c4ca85b';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_e0c3e040bd3b41659c26';
UPDATE "Faculty" SET name = 'School of Engineering & Applied Sciences', "nameAr" = 'مدرسة الهندسة والعلوم التطبيقية' WHERE id = 'fac_9b9a17cae58a4ed8a37a';
UPDATE "Faculty" SET name = 'School of Information Technology & Computer Science', "nameAr" = 'مدرسة تكنولوجيا المعلومات وعلوم الحاسب' WHERE id = 'fac_79f5570c56a84848bf9e';
UPDATE "Faculty" SET name = 'School of Business Administration', "nameAr" = 'مدرسة إدارة الأعمال' WHERE id = 'fac_c8e73e0f77604473b810';
UPDATE "Faculty" SET name = 'School of Biotechnology', "nameAr" = 'مدرسة التكنولوجيا الحيوية' WHERE id = 'fac_69667fed164b422aaa39';
UPDATE "Faculty" SET name = 'School of Energy & Environmental Engineering', "nameAr" = 'مدرسة هندسة الطاقة والبيئة' WHERE id = 'fac_f218645bada44bec8976';
UPDATE "Faculty" SET name = 'School of Digital Humanities', "nameAr" = 'مدرسة العلوم الإنسانية الرقمية' WHERE id = 'fac_969855c3dd1a4e069338';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_de46f2c2e5ea42bf9225';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_acaf38d21a6d4c4ea615';
UPDATE "Faculty" SET name = 'Faculty of Arts & Humanities', "nameAr" = 'كلية الآداب والعلوم الإنسانية' WHERE id = 'fac_23aa5cb6c453463b921c';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية الحقوق' WHERE id = 'fac_1a69c056c0954e8a8114';
UPDATE "Faculty" SET name = 'School of Water Science & Food Security', "nameAr" = 'مدرسة علوم المياه والأمن الغذائي' WHERE id = 'fac_9e478f9567184a27a2fe';
UPDATE "Faculty" SET name = 'School of Sciences', "nameAr" = 'مدرسة العلوم' WHERE id = 'fac_d1030e49a9d8494da9f6';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_2bd0d4da8dcb4c32bee8';
UPDATE "Faculty" SET name = 'Faculty of Computers & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_4ffae997b78f4614bb97';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_9f5787b5a3da4e34a833';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_fa55f74193564dc99470';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_7a40b88772764afe926b';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_af45bcbf164a41859489';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية والتطبيقية' WHERE id = 'fac_242b2db56be04ea0b4c4';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_e1eed2c8875548d6b579';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_4dedb1f5e46047cba54a';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_9c16642eb1404e70801d';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_bde544d141fe46448926';
UPDATE "Faculty" SET name = 'Faculty of Information Systems & Computer Science', "nameAr" = 'كلية نظم المعلومات وعلوم الحاسب' WHERE id = 'fac_dccc1e10e5404ab4848e';
UPDATE "Faculty" SET name = 'Faculty of Applied Arts', "nameAr" = 'كلية الفنون التطبيقية' WHERE id = 'fac_52c3a30ee6af45db9397';
UPDATE "Faculty" SET name = 'Faculty of Economics', "nameAr" = 'كلية الاقتصاد' WHERE id = 'fac_7a9032494fd94dc39fb4';
UPDATE "Faculty" SET name = 'Faculty of Languages & Translation', "nameAr" = 'كلية اللغات والترجمة' WHERE id = 'fac_9759c007a2574550bd3a';
UPDATE "Faculty" SET name = 'Faculty of Media & Communication Arts', "nameAr" = 'كلية الإعلام وفنون الاتصال' WHERE id = 'fac_6df1157bdc07472bbcb2';
UPDATE "Faculty" SET name = 'Faculty of Education', "nameAr" = 'كلية التربية' WHERE id = 'fac_890c013ec0274e98b950';
UPDATE "Faculty" SET name = 'Faculty of Tourism & Hotels', "nameAr" = 'كلية السياحة والفنادق' WHERE id = 'fac_05d9beb9063c4aedb7ee';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_d188090a5f044ad89746';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_eacc2f8d2e374db082be';
UPDATE "Faculty" SET name = 'Faculty of Computers & Information Technology', "nameAr" = 'كلية الحاسبات وتكنولوجيا المعلومات' WHERE id = 'fac_12f7dd232f0b47fba77d';
UPDATE "Faculty" SET name = 'Faculty of Business Administration & Economics', "nameAr" = 'كلية إدارة الأعمال والاقتصاد' WHERE id = 'fac_ea85092146c247d88db0';
UPDATE "Faculty" SET name = 'Faculty of Fine Arts', "nameAr" = 'كلية الفنون' WHERE id = 'fac_142b81ff3f9840dd8e6c';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_e00ef253c0c84ab8a17a';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_542299f142274866981f';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_70f80f1a74cb453d8224';
UPDATE "Faculty" SET name = 'Faculty of Informatics & Computer Science', "nameAr" = 'كلية المعلوماتية وعلوم الحاسب' WHERE id = 'fac_373f072a77b7458b9a1b';
UPDATE "Faculty" SET name = 'Faculty of Pharmaceutical Engineering', "nameAr" = 'كلية الهندسة الصيدلانية' WHERE id = 'fac_545fbb763f314cc9abeb';
UPDATE "Faculty" SET name = 'Faculty of Architectural Engineering', "nameAr" = 'كلية الهندسة المعمارية' WHERE id = 'fac_24a8e57b2a9d47f79f47';
UPDATE "Faculty" SET name = 'Faculty of Economics & Business Administration', "nameAr" = 'كلية الاقتصاد وإدارة الأعمال' WHERE id = 'fac_2ce54d25cd1c4e86a30a';
UPDATE "Faculty" SET name = 'Faculty of Business Informatics', "nameAr" = 'كلية معلوماتية الأعمال' WHERE id = 'fac_a90d6e2bf98c4ca09a9d';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_d15e870cc23f47c3a6f9';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_ae820aedda2a4713a49f';
UPDATE "Faculty" SET name = 'Faculty of Design', "nameAr" = 'كلية التصميم' WHERE id = 'fac_f28c8c7d71e649b5ac98';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_3f53b6eab05e42938e52';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_8c99ca4be4b2451f8c7b';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_3c1e4688d3ae4db682fa';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_0f03949184a54a2c9a6a';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Information Technology', "nameAr" = 'كلية علوم الحاسب وتكنولوجيا المعلومات' WHERE id = 'fac_845a82a6dc8045f9a323';
UPDATE "Faculty" SET name = 'Faculty of Design & Creative Arts', "nameAr" = 'كلية التصميم والفنون الإبداعية' WHERE id = 'fac_2d9cab74215e421098c0';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_779aadf965184b5d95e7';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_d26d95a797194988bb85';
UPDATE "Faculty" SET name = 'Faculty of Languages & Translation', "nameAr" = 'كلية اللغات والترجمة' WHERE id = 'fac_eb0f64b1e9014b1fb3ca';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_b0934fd1ec9242389207';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_efc5334494c64bb687fa';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_52a188d45ca7492297e3';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_8ac8ec8881e842ba9b2d';
UPDATE "Faculty" SET name = 'Faculty of Applied Arts', "nameAr" = 'كلية الفنون التطبيقية' WHERE id = 'fac_475bdc418c894df98738';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_2b134f8d0a0c44c6a8b4';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_5640d3d93c1e49eeb681';
UPDATE "Faculty" SET name = 'Faculty of Engineering & Technology', "nameAr" = 'كلية الهندسة والتكنولوجيا' WHERE id = 'fac_64c1527dc78a48018fe4';
UPDATE "Faculty" SET name = 'Faculty of Computers & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_920eacf7df1d4f4f9642';
UPDATE "Faculty" SET name = 'Faculty of Management & Entrepreneurship', "nameAr" = 'كلية الإدارة وريادة الأعمال' WHERE id = 'fac_ff4da051a55b493b99ba';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_30302d45571b40f99b80';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_e79d7b65f88a48aeb335';
UPDATE "Faculty" SET name = 'Faculty of Computers, Information & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والمعلومات والذكاء الاصطناعي' WHERE id = 'fac_81c03f9b4fa245a9ba6f';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_fa89c84c4cda41ab8fda';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_065afa72ecd34efeb93d';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_2c964201300b4a869d34';
UPDATE "Faculty" SET name = 'Faculty of Management, Economics & Political Science', "nameAr" = 'كلية الإدارة والاقتصاد والعلوم السياسية' WHERE id = 'fac_b9e376fc3be44042b549';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_5c135defe6794a95bf6c';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_e798ff90ae2742a3a504';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_e9e3d55f2520434797a8';
UPDATE "Faculty" SET name = 'Faculty of Economics & Administrative Sciences', "nameAr" = 'كلية الاقتصاد والعلوم الإدارية' WHERE id = 'fac_a0150ab52ce94c12bdf4';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_45b478b280544fdbb2ae';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_c41f136a557640378912';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_8d2a98cf255e4f1d8182';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_14cb9bd368c24e0391aa';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_7ca5cd18f7ee483e804b';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_e243f157b8944675978f';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_bfd7ca8b23254213aa5e';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_071b34e199044229aafb';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_7a0fd99e99ad4b9aa740';
UPDATE "Faculty" SET name = 'Faculty of Fine Arts', "nameAr" = 'كلية الفنون الجميلة' WHERE id = 'fac_988fa89298d64ccdbefa';
UPDATE "Faculty" SET name = 'Faculty of Media & Public Relations', "nameAr" = 'كلية الإعلام والعلاقات العامة' WHERE id = 'fac_4764db06342b4328acb3';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_d92d05c86f8d4757890d';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_4e326a48b05242088772';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Information Technology', "nameAr" = 'كلية علوم الحاسب وتكنولوجيا المعلومات' WHERE id = 'fac_5867289c26b344d3808d';
UPDATE "Faculty" SET name = 'Faculty of Basic & Applied Sciences', "nameAr" = 'كلية العلوم الأساسية والتطبيقية' WHERE id = 'fac_3222e421f48f475f9f69';
UPDATE "Faculty" SET name = 'Faculty of International Business & Humanities', "nameAr" = 'كلية إدارة الأعمال الدولية والإنسانيات' WHERE id = 'fac_5d8d8a01783c4719bc4b';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_394b01876f6f464f8fee';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_49b92859481940b49ded';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_940f510a2ff04425a51f';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_f593ff336f25411c991c';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_389cbcf86b0045d28bd8';
UPDATE "Faculty" SET name = 'Faculty of Nutrition & Food Technology', "nameAr" = 'كلية التغذية وتكنولوجيا الغذاء' WHERE id = 'fac_88ce63fe352f483588a3';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_423023f97f0b45bc87d4';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_d867ed1f59c748429849';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_d16daf479b8b4058b469';
UPDATE "Faculty" SET name = 'Faculty of Languages & Translation', "nameAr" = 'كلية اللغات والترجمة' WHERE id = 'fac_429e990af12448deac0b';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_59715b718b4a42fcb247';
UPDATE "Faculty" SET name = 'Faculty of Management Sciences', "nameAr" = 'كلية علوم الإدارة' WHERE id = 'fac_7d8d87e3fb69464585e2';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_1e674d68403846e18cf9';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_2c32c244374746908dd6';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_25a25ca38db745e2a351';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_77c7b3e956e5443b812f';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_eb632295e246469fada7';
UPDATE "Faculty" SET name = 'Faculty of Fine Arts', "nameAr" = 'كلية الفنون الجميلة' WHERE id = 'fac_d52818c180a1429185f9';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_150ef988af554cb7b5c5';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_e2ea71193f0b4e81b395';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_2bc2b146d5744ddcb715';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_f6ef277b81224a99b18c';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_c196a614caf44854b132';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_501a741eef8a4432ad5c';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_da6f1381f75f4e5dac83';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_f11ff118660941ddb051';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية الحقوق' WHERE id = 'fac_d595119a062d4baea2ab';
UPDATE "Faculty" SET name = 'Faculty of Political Science & International Relations', "nameAr" = 'كلية العلوم السياسية والعلاقات الدولية' WHERE id = 'fac_fa3f83f8bc4941aaa12f';
UPDATE "Faculty" SET name = 'Faculty of Humanities & Social Sciences', "nameAr" = 'كلية الإنسانيات والعلوم الاجتماعية' WHERE id = 'fac_1315ab9bf5c34435a27f';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_79638da8ac47456a8cb5';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_8ab2a04a84604626b8f2';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_a97ad2a7ee1142bfb5e1';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_752f3136ca624573bd38';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_f3b38ac22be140cdb9fb';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية الحقوق' WHERE id = 'fac_2389612ba8fc4bf2a866';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_cf84e73ce5db4c009f76';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_86c48120eff14b35ac9a';
UPDATE "Faculty" SET name = 'Faculty of Artificial Intelligence', "nameAr" = 'كلية الذكاء الاصطناعي' WHERE id = 'fac_9065cc256c784a389894';
UPDATE "Faculty" SET name = 'Faculty of Languages & Translation', "nameAr" = 'كلية اللغات والترجمة' WHERE id = 'fac_8d096abdbf9d4d7a97d5';
UPDATE "Faculty" SET name = 'Faculty of Management, Financial & Economic Sciences', "nameAr" = 'كلية الإدارة والعلوم المالية والاقتصادية' WHERE id = 'fac_1b574bfc860c4640921d';
UPDATE "Faculty" SET name = 'Faculty of Applied Arts', "nameAr" = 'كلية الفنون التطبيقية' WHERE id = 'fac_9a10ec5dd93a487f90c4';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_91d76fbae5644810a253';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_ed1ae976a0b84c839a7b';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_58bb80c6892941029f58';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_507bf58253374db8ac2e';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_87b5c6166c7148ff8415';
UPDATE "Faculty" SET name = 'Faculty of Artificial Intelligence & Informatics', "nameAr" = 'كلية الذكاء الاصطناعي والمعلومات' WHERE id = 'fac_bbffcdf9b4404aeb9f86';
UPDATE "Faculty" SET name = 'Faculty of Fine Arts & Design', "nameAr" = 'كلية الفنون الجميلة والتصميم' WHERE id = 'fac_b4dcab4637f94c6b952c';
UPDATE "Faculty" SET name = 'Faculty of Al-Alsun & Translation', "nameAr" = 'كلية الألسن والترجمة' WHERE id = 'fac_e99683e3416948ccace7';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_001bad161e7e4062908d';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_c41c26116ea04377ae92';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_6eedfa401f2f4dd09d53';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_50c0e6ad21754956b902';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_2b7829508fa94396b81b';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_1b54226c12d2496e9ea0';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_79fc1acc668c4b49b661';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_af124f7888104c34be9d';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_f9eb3a1855164d89841f';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_97b39c164c554d2687ec';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_f16238cf74a34d91aeeb';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_fb488eb07e634b2e9437';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_ca4c7d901ea44d71b3ec';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_741fb7a9ec8343a095fe';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_230cf7cec1914bdba251';
UPDATE "Faculty" SET name = 'Faculty of Artificial Intelligence', "nameAr" = 'كلية الذكاء الاصطناعي' WHERE id = 'fac_9e180ee5d0e5464eb5de';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_7edb29bb9fa64cab8adb';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_aa363706253a47e392cc';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_153d887c589c46f6b84e';
UPDATE "Faculty" SET name = 'Faculty of Information Technology & Computer Science', "nameAr" = 'كلية تكنولوجيا المعلومات وعلوم الحاسب' WHERE id = 'fac_5726ffbe154a4dc29978';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_305218b7e4fa4b52ab6d';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_94ec0267739b44a6a9ea';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_be7058313c1d43dba0fe';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_7ecb7574668a43c78160';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_f96f13d56a5a4247afa1';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Information Technology', "nameAr" = 'كلية علوم الحاسب وتكنولوجيا المعلومات' WHERE id = 'fac_b3bf3f074d354379a770';
UPDATE "Faculty" SET name = 'Faculty of Economics & Business Administration', "nameAr" = 'كلية الاقتصاد وإدارة الأعمال' WHERE id = 'fac_301e103e640146f9bb3f';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_77566d456e574e0d9913';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_6a90d874079c4950abef';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_85c8be61b42043ea827a';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_660916dcae2243a78685';
UPDATE "Faculty" SET name = 'Faculty of Languages & Translation', "nameAr" = 'كلية اللغات والترجمة' WHERE id = 'fac_e561b3d06dec48e58937';
UPDATE "Faculty" SET name = 'Faculty of Architectural Engineering', "nameAr" = 'كلية الهندسة المعمارية' WHERE id = 'fac_f1cab98715d04c96903d';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_4419ea4950d7421aa164';
UPDATE "Faculty" SET name = 'Faculty of Legal Studies & International Transactions', "nameAr" = 'كلية الدراسات القانونية والمعاملات الدولية' WHERE id = 'fac_adc33b86ed39430389d9';
UPDATE "Faculty" SET name = 'Faculty of Tourism & Hotel Management', "nameAr" = 'كلية السياحة وإدارة الفنادق' WHERE id = 'fac_cba3833b1a4d4f3cb847';
UPDATE "Faculty" SET name = 'Faculty of Financial & Administrative Sciences', "nameAr" = 'كلية العلوم المالية والإدارية' WHERE id = 'fac_0ddf952433b945ba895a';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_074d170046ce425aab54';
UPDATE "Faculty" SET name = 'Faculty of Media & Communication Arts', "nameAr" = 'كلية الإعلام وفنون الاتصال' WHERE id = 'fac_d7dc6bc7ab6845049945';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Artificial Intelligence', "nameAr" = 'كلية علوم الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_4ce799d566ca458e93cc';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_cec34a00fa634698a67a';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_ea730702fd1e4fee9028';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_bbef57ae056a4f2cbeae';
UPDATE "Faculty" SET name = 'Faculty of Business Administration & Finance', "nameAr" = 'كلية إدارة الأعمال والتمويل' WHERE id = 'fac_354d991529bc41ae8d1a';
UPDATE "Faculty" SET name = 'Faculty of Economics & Political Science', "nameAr" = 'كلية الاقتصاد والعلوم السياسية' WHERE id = 'fac_22f1a9f2fcba49ff83be';
UPDATE "Faculty" SET name = 'Faculty of Information Technology', "nameAr" = 'كلية تكنولوجيا المعلومات' WHERE id = 'fac_62bbad8883b243fa8845';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_f8aff889c5e34fdeb1d0';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_3b23c494eee64019b661';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_75c9757dc9cb429cb84a';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_0d9094159402404fa238';
UPDATE "Faculty" SET name = 'Faculty of Bio-Agriculture', "nameAr" = 'كلية الزراعة الحيوية' WHERE id = 'fac_4789faef9b004483a5df';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_0901078a02644bf0afa6';
UPDATE "Faculty" SET name = 'Faculty of Business Administration & Economics', "nameAr" = 'كلية إدارة الأعمال والاقتصاد' WHERE id = 'fac_c2ab84ab54ba4a0c8225';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_9d6e61a464c84f1e8e0d';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_3b7e3216c7d14fdf8072';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_067b4d2bab7347bdb466';
UPDATE "Faculty" SET name = 'Faculty of Politics, Economics & Business Administration', "nameAr" = 'كلية السياسة والاقتصاد وإدارة الأعمال' WHERE id = 'fac_9b1cd421d241453698fe';
UPDATE "Faculty" SET name = 'Faculty of Computers & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_c2e7aaa7cd024ddf9ff0';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_f3ec01071cda41ed8226';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_0ae7a781813e468b95c5';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_5e3dddf9563d403b96da';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_9368101b46194ca2b508';
UPDATE "Faculty" SET name = 'Faculty of Oral & Dental Medicine', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_528496270a894490a67c';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_67ff91f0924d47eaae1d';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_0da8fd2ce70f42e5b5df';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_01372eedbb7047c48ceb';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_33b0c80254984776a9ec';
UPDATE "Faculty" SET name = 'Faculty of Management', "nameAr" = 'كلية الإدارة' WHERE id = 'fac_ae9d365aea44443ca5ea';
UPDATE "Faculty" SET name = 'Faculty of Computers & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_708a136553714be082aa';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_971b8ed08f8b4959b8d0';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_d26afb6bb5b84a56aa61';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_5b2b559e3ecb41b9834e';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_0e9f1687c18049c89231';
UPDATE "Faculty" SET name = 'Faculty of Biotechnology', "nameAr" = 'كلية التكنولوجيا الحيوية' WHERE id = 'fac_bd738eeaf6df47a5a5da';
UPDATE "Faculty" SET name = 'Science, Engineering & Architecture', "nameAr" = 'العلوم والهندسة والعمارة' WHERE id = 'fac_b25921eb583447cc9fb6';
UPDATE "Faculty" SET name = 'Management & Information Systems', "nameAr" = 'الإدارة ونظم المعلومات' WHERE id = 'fac_f10f04a3783b4270ace1';
UPDATE "Faculty" SET name = 'Applied Languages & Humanities', "nameAr" = 'اللغات التطبيقية والعلوم الإنسانية' WHERE id = 'fac_437c4129bc8b478aa15a';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_11f54437c1c14fcd8098';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy & Drug Technology', "nameAr" = 'كلية الصيدلة وتكنولوجيا الدواء' WHERE id = 'fac_f36ba49d29ae4290a6ca';
UPDATE "Faculty" SET name = 'Faculty of Engineering & Technology', "nameAr" = 'كلية الهندسة والتكنولوجيا' WHERE id = 'fac_c4be4fcae9ef4e749548';
UPDATE "Faculty" SET name = 'Faculty of Economics & International Trade', "nameAr" = 'كلية الاقتصاد والتجارة الدولية' WHERE id = 'fac_77295ee5c298401593e6';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_003712a7e2064a84a781';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_8cf3396ea1d2455ebbd1';
UPDATE "Faculty" SET name = 'Faculty of Computers & Information Systems', "nameAr" = 'كلية الحاسبات ونظم المعلومات' WHERE id = 'fac_cf6e869b50cb45839be4';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_d87701336f0b433f8816';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_671eac29197249a583fb';
UPDATE "Faculty" SET name = 'Faculty of Literary Studies', "nameAr" = 'كلية الدراسات الأدبية' WHERE id = 'fac_91a2eb54b6bc41cfb429';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية القانون' WHERE id = 'fac_9b14ffd082ce47929deb';
UPDATE "Faculty" SET name = 'Faculty of Humanities', "nameAr" = 'كلية الإنسانيات' WHERE id = 'fac_bca5bdb7e5894ba2bb0c';
UPDATE "Faculty" SET name = 'School of Business', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_b7677167ae924b7d81d6';
UPDATE "Faculty" SET name = 'School of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_a02d8aeaa555402daf4b';
UPDATE "Faculty" SET name = 'School of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_67a54ff144fe485e8c82';
UPDATE "Faculty" SET name = 'School of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_bbd02c8f7ea7439a95cd';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_714c71100f8c445b871f';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_275fbaf81e3343d0aca1';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_66381f4acaf749da8585';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_1c2994a3a07e41549df8';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_73f5b6020d0343218686';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Engineering', "nameAr" = 'كلية علوم وهندسة الحاسب' WHERE id = 'fac_56755177ad4c487894ea';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_07f4ae804e854946ae74';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_5965480ff3bc4b6185c6';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_fa62587b4b594d5094fb';
UPDATE "Faculty" SET name = 'Faculty of Science', "nameAr" = 'كلية العلوم' WHERE id = 'fac_4e3c4d546f134d26883b';
UPDATE "Faculty" SET name = 'Faculty of Business', "nameAr" = 'كلية الأعمال' WHERE id = 'fac_b09ba2843f4140819772';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية القانون' WHERE id = 'fac_38663a9146224652af71';
UPDATE "Faculty" SET name = 'Faculty of Computer & Information Sciences', "nameAr" = 'كلية علوم الحاسب والمعلومات' WHERE id = 'fac_1ed39521ff544ecbbec5';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_772d1b24ed0d4c9bb523';
UPDATE "Faculty" SET name = 'Faculty of Business Information Systems', "nameAr" = 'كلية نظم معلومات الأعمال' WHERE id = 'fac_0b338847193644a892f3';
UPDATE "Faculty" SET name = 'Faculty of Digital Arts & Design', "nameAr" = 'كلية الفنون الرقمية والتصميم' WHERE id = 'fac_c6779bf69a1b43dd890c';
UPDATE "Faculty" SET name = 'Faculty of Business', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_ab66e6b810654fc0a93a';
UPDATE "Faculty" SET name = 'Faculty of Engineering & Computer Science', "nameAr" = 'كلية الهندسة وعلوم الحاسب' WHERE id = 'fac_ba225ff5c1224320b404';
UPDATE "Faculty" SET name = 'Faculty of Pharmaceutical Sciences & Pharmacy', "nameAr" = 'كلية العلوم الصيدلانية والصيدلة' WHERE id = 'fac_172bda27dc30463b9ab0';
UPDATE "Faculty" SET name = 'Faculty of Psychology, Nutrition & Neuroscience', "nameAr" = 'كلية علم النفس والتغذية وعلوم الأعصاب' WHERE id = 'fac_bafd62ead98b4ef7a6a4';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_80bd2407dd4049b8ad3b';
UPDATE "Faculty" SET name = 'Faculty of Media', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_a9642aeff6074fcea251';
UPDATE "Faculty" SET name = 'Faculty of Creative Arts', "nameAr" = 'كلية الفنون الإبداعية' WHERE id = 'fac_442901c98f6e4da4a579';
UPDATE "Faculty" SET name = 'Economics, Management, Finance & Social Sciences', "nameAr" = 'الاقتصاد والإدارة والتمويل والعلوم الاجتماعية' WHERE id = 'fac_cf5778fa30f84f6c991f';
UPDATE "Faculty" SET name = 'Law', "nameAr" = 'القانون' WHERE id = 'fac_a239594de5b94b5f959b';
UPDATE "Faculty" SET name = 'Psychology', "nameAr" = 'علم النفس' WHERE id = 'fac_47e83e44a77e45e5a382';
UPDATE "Faculty" SET name = 'Computer Science', "nameAr" = 'علوم الحاسبات' WHERE id = 'fac_aa1442be317d4c78abc0';
UPDATE "Faculty" SET name = 'Faculty of Business', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_703220050b8b4fc99ef4';
UPDATE "Faculty" SET name = 'Faculty of Computational Sciences & Artificial Intelligence', "nameAr" = 'كلية علوم الحوسبة والذكاء الاصطناعي' WHERE id = 'fac_4ce628c2f3de4a808a41';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_66204ed188c14872915d';
UPDATE "Faculty" SET name = 'Faculty of Science', "nameAr" = 'كلية العلوم' WHERE id = 'fac_d3a152f8cd8645cfad2b';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_69f243aff9c349a1ae10';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_64f72a1acb144d278a0d';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_2ca4badbfd304c84a473';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_061d19f7d6cc43178940';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_2c213172c09e44d7b7b5';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_946df4b2c57545829e1e';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_c19816c17dc147aeba73';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_3f1a60b1e4bd4bd5abef';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_eacc9e9a3a3f4765abf7';
UPDATE "Faculty" SET name = 'Faculty of Computers & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والذكاء الاصطناعي' WHERE id = 'fac_35e7280bb7dd4be38e2e';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_bd00707f10514622881a';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الفم والأسنان' WHERE id = 'fac_c97750153b1f412598f7';
UPDATE "Faculty" SET name = 'Faculty of Pharmaceutical Sciences', "nameAr" = 'كلية العلوم الصيدلية' WHERE id = 'fac_d72ce65dce5b46bb873b';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_49791b2212674cd499f2';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_771e7517423641a3b2d7';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_f945461a65184c92b6ee';
UPDATE "Faculty" SET name = 'Faculty of Food & Food Industries', "nameAr" = 'كلية الغذاء والصناعات الغذائية' WHERE id = 'fac_1680475f29d049279947';
UPDATE "Faculty" SET name = 'Faculty of Social & Human Sciences', "nameAr" = 'كلية العلوم الاجتماعية والإنسانية' WHERE id = 'fac_978e8fac38884b96bd0e';
UPDATE "Faculty" SET name = 'Faculty of Basic Sciences', "nameAr" = 'كلية العلوم الأساسية' WHERE id = 'fac_3fedb4b0207449f2a7f2';
UPDATE "Faculty" SET name = 'Faculty of Administrative Sciences', "nameAr" = 'كلية العلوم الإدارية' WHERE id = 'fac_bd9f9acd6fa446e4b9fc';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_96bdedb426204adb8e48';
UPDATE "Faculty" SET name = 'Faculty of Nursing Sciences', "nameAr" = 'كلية علوم التمريض' WHERE id = 'fac_c4aa9777a6a04f5ba48f';
UPDATE "Faculty" SET name = 'Faculty of Media Production', "nameAr" = 'كلية الإنتاج الإعلامي' WHERE id = 'fac_445844c6f186428cb404';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_27a93e634e8b4669ac2d';
UPDATE "Faculty" SET name = 'Faculty of Advanced Basic Sciences', "nameAr" = 'كلية العلوم الأساسية المتقدمة' WHERE id = 'fac_3b01d0cf08b64fe2ba8e';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_b80454c0f3d64835b7e9';
UPDATE "Faculty" SET name = 'Faculty of Business Administration', "nameAr" = 'كلية إدارة الأعمال' WHERE id = 'fac_758c11e077474118a905';
UPDATE "Faculty" SET name = 'Faculty of Computer Science & Engineering', "nameAr" = 'كلية علوم وهندسة الحاسبات' WHERE id = 'fac_2356fd821a58475185b4';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_5e2f853fa50d4100ae20';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_4f8949fd25d04fecb141';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_963b071fd7cf4cff9584';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_a0587e31149a4cc18974';
UPDATE "Faculty" SET name = 'Faculty of Public Health', "nameAr" = 'كلية الصحة العامة' WHERE id = 'fac_19fd8e3b18184d2b808e';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_a112a5c96d1e42dc94f0';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_ee9de76c95834145af4d';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_97aae0e89f304ff8ba59';
UPDATE "Faculty" SET name = 'Faculty of Technological Industries', "nameAr" = 'كلية الصناعات التكنولوجية' WHERE id = 'fac_9965e4144c2943dda5cc';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_5f761e3affd54f549678';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_a05809a9df994f7e813f';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_2114d03b1de942d5ab8a';
UPDATE "Faculty" SET name = 'Faculty of Al-Alsun & Applied Languages', "nameAr" = 'كلية الألسن واللغات التطبيقية' WHERE id = 'fac_a4141ff8d18f4c8d8322';
UPDATE "Faculty" SET name = 'Faculty of Tourism & Hospitality', "nameAr" = 'كلية السياحة والضيافة' WHERE id = 'fac_095150c8b03b42febb49';
UPDATE "Faculty" SET name = 'Faculty of Arts & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_9499280522cd4ee0b34a';
UPDATE "Faculty" SET name = 'Faculty of Architectural Engineering', "nameAr" = 'كلية هندسة العمارة' WHERE id = 'fac_71d8aec4428542598bdb';
UPDATE "Faculty" SET name = 'Faculty of Administrative Sciences', "nameAr" = 'كلية العلوم الإدارية' WHERE id = 'fac_59d46e4effea412d9482';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_a581f14e70f74f40aca4';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_c88dcadc3a914620910a';
UPDATE "Faculty" SET name = 'Faculty of Basic Sciences', "nameAr" = 'كلية العلوم الأساسية' WHERE id = 'fac_b4ef5ef1eb484dc3bf2b';
UPDATE "Faculty" SET name = 'Faculty of Desert Agriculture', "nameAr" = 'كلية الزراعات الصحراوية' WHERE id = 'fac_2925b044b39f4c519107';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_424f0abf8faa44d08f1a';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_59ace896bb2342f696b7';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_9cf06be8119d4a01b2c0';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_951c25ec46ff4a34b622';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_d9ff608cf9cd46a5bfbc';
UPDATE "Faculty" SET name = 'Faculty of Computer Science', "nameAr" = 'كلية علوم الحاسب' WHERE id = 'fac_fa0d47d87ffa49708a4e';
UPDATE "Faculty" SET name = 'Faculty of Economics & Business Administration', "nameAr" = 'كلية الاقتصاد وإدارة الأعمال' WHERE id = 'fac_db60156e092247ca9fa1';
UPDATE "Faculty" SET name = 'Faculty of Visual Arts & Design', "nameAr" = 'كلية الفنون البصرية والتصميم' WHERE id = 'fac_3602330b784c42858adc';
UPDATE "Faculty" SET name = 'Faculty of Energy Sciences', "nameAr" = 'كلية علوم الطاقة' WHERE id = 'fac_573e14af1a1a495b91df';
UPDATE "Faculty" SET name = 'Faculty of Applied Health Sciences Technology', "nameAr" = 'كلية تكنولوجيا العلوم الصحية التطبيقية' WHERE id = 'fac_12d54cc47ae6446795b5';
UPDATE "Faculty" SET name = 'College of Maritime Transport & Technology', "nameAr" = 'كلية النقل البحري والتكنولوجيا' WHERE id = 'fac_5f4d92498b134a2ebe39';
UPDATE "Faculty" SET name = 'College of Engineering & Technology', "nameAr" = 'كلية الهندسة والتكنولوجيا' WHERE id = 'fac_d23c5cb5198846148bb3';
UPDATE "Faculty" SET name = 'College of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_2681eef8f21b4afba530';
UPDATE "Faculty" SET name = 'College of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_22c46aa4e1f54a4cbc56';
UPDATE "Faculty" SET name = 'College of Computing & Information Technology', "nameAr" = 'كلية الحاسبات وتكنولوجيا المعلومات' WHERE id = 'fac_5f578cbfee0d4a38b693';
UPDATE "Faculty" SET name = 'College of Management & Technology', "nameAr" = 'كلية الإدارة والتكنولوجيا' WHERE id = 'fac_bd82648a47dc48958a7a';
UPDATE "Faculty" SET name = 'College of Hotel & Tourism Management', "nameAr" = 'كلية السياحة والفندقة' WHERE id = 'fac_fe2b13dcdcc347a58977';
UPDATE "Faculty" SET name = 'College of International Transport & Logistics', "nameAr" = 'كلية النقل الدولي واللوجستيات' WHERE id = 'fac_84449e90dfbc4b328e8f';
UPDATE "Faculty" SET name = 'College of Language & Communication', "nameAr" = 'كلية اللغة والإعلام' WHERE id = 'fac_712c2a885ad14798b6f9';
UPDATE "Faculty" SET name = 'College of Fisheries Technology & Aquaculture', "nameAr" = 'كلية تكنولوجيا المصايد والاستزراع المائي' WHERE id = 'fac_74aeeb08026d451e8013';
UPDATE "Faculty" SET name = 'College of Law', "nameAr" = 'كلية القانون' WHERE id = 'fac_1dd93124854744568ab8';
UPDATE "Faculty" SET name = 'College of Medicine', "nameAr" = 'كلية الطب البشري' WHERE id = 'fac_afb6d2dbef814d198796';
UPDATE "Faculty" SET name = 'College of Art & Design', "nameAr" = 'كلية الفنون والتصميم' WHERE id = 'fac_5c00ad6619e244e6a863';
UPDATE "Faculty" SET name = 'College of Artificial Intelligence', "nameAr" = 'كلية الذكاء الاصطناعي' WHERE id = 'fac_42fdab8460ce46dcb42c';
UPDATE "Faculty" SET name = 'College of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_e4cbc37e6e714f9b9a87';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_bede5a546c2648bbbf10';
UPDATE "Faculty" SET name = 'Faculty of Dentistry', "nameAr" = 'كلية طب الأسنان' WHERE id = 'fac_396c87e4fa8b45a28157';
UPDATE "Faculty" SET name = 'Faculty of Pharmacy', "nameAr" = 'كلية الصيدلة' WHERE id = 'fac_3536778cf46149768ec3';
UPDATE "Faculty" SET name = 'Faculty of Physical Therapy', "nameAr" = 'كلية العلاج الطبيعي' WHERE id = 'fac_e906d1aea4a241ca82b9';
UPDATE "Faculty" SET name = 'Faculty of Nursing', "nameAr" = 'كلية التمريض' WHERE id = 'fac_2f1221c5dff24d1a8e5b';
UPDATE "Faculty" SET name = 'Faculty of Veterinary Medicine', "nameAr" = 'كلية الطب البيطري' WHERE id = 'fac_ea4c10bc35e148658bed';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_864d0b468a19476c85ce';
UPDATE "Faculty" SET name = 'Faculty of Computers, Information & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والمعلومات والذكاء الاصطناعي' WHERE id = 'fac_c2bffe073887447e885d';
UPDATE "Faculty" SET name = 'Faculty of Science', "nameAr" = 'كلية العلوم' WHERE id = 'fac_54401da919fd47cdb8a2';
UPDATE "Faculty" SET name = 'Faculty of Economics & Political Science', "nameAr" = 'كلية الاقتصاد والسياسة' WHERE id = 'fac_1d514974c4a64e6599f6';
UPDATE "Faculty" SET name = 'Faculty of Mass Communication', "nameAr" = 'كلية الإعلام' WHERE id = 'fac_15394a6e8a63409c8358';
UPDATE "Faculty" SET name = 'Faculty of Early Childhood Education', "nameAr" = 'كلية التربية للطفولة المبكرة' WHERE id = 'fac_f9bf199f50fe4fe896c7';
UPDATE "Faculty" SET name = 'Faculty of Law', "nameAr" = 'كلية القانون' WHERE id = 'fac_441d4f9579394fc7a8ca';
UPDATE "Faculty" SET name = 'Faculty of Business', "nameAr" = 'كلية الأعمال' WHERE id = 'fac_78de1049c5d64d7889a3';
UPDATE "Faculty" SET name = 'Faculty of Commerce', "nameAr" = 'كلية التجارة' WHERE id = 'fac_f9ea6e6ddb02438ca7ae';
UPDATE "Faculty" SET name = 'Faculty of Medicine', "nameAr" = 'كلية الطب' WHERE id = 'fac_319201ff30374b3ea237';
UPDATE "Faculty" SET name = 'Faculty of Engineering', "nameAr" = 'كلية الهندسة' WHERE id = 'fac_a8057b7530024f2db340';
UPDATE "Faculty" SET name = 'Faculty of Computers, Information & Artificial Intelligence', "nameAr" = 'كلية الحاسبات والمعلومات والذكاء الاصطناعي' WHERE id = 'fac_93d2aa7cc57f4779b668';
UPDATE "Faculty" SET name = 'Faculty of Business', "nameAr" = 'كلية الأعمال' WHERE id = 'fac_476d34df030b467dbd28';
UPDATE "University" SET "isFeatured" = (slug IN ('badr-university-in-cairo', 'future-university-in-egypt', 'german-university-in-cairo-guc', 'misr-international-university-miu', 'misr-university-for-science-and-technology', 'nile-university', 'october-6-university', 'british-university-in-egypt'));
UPDATE "University" SET "isRecommended" = (slug IN ('german-university-in-cairo-guc', 'british-university-in-egypt', 'misr-university-for-science-and-technology', 'nile-university')), "isTrending" = (slug IN ('german-university-in-cairo-guc', 'badr-university-in-cairo', 'misr-university-for-science-and-technology', 'nile-university'));

COMMIT;
