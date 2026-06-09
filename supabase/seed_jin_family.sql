-- ============================================================
-- 金氏家族数据导入脚本
-- 执行方式：Supabase Dashboard → SQL Editor → New query → 粘贴执行
-- 注意：需要先创建家族（families 表），获取 family_id 后替换下面的 :family_id
-- ============================================================

-- 步骤 1：创建金氏家族（手动执行后获取 id）
-- INSERT INTO families (slug, name, description, origin, admin_id, plan)
-- VALUES ('jin-family', '金氏家族', '聚是一团火，散作满天星', '湖北枣阳', auth.uid(), 'free')
-- RETURNING id;

-- 步骤 2：将获取到的 family_id 替换到下面的变量
-- SET app.family_id = 'YOUR_FAMILY_UUID';

-- 步骤 3：执行成员插入（按代顺序）

-- ============================================================
-- 第一代：金如香（创始人）
-- ============================================================
INSERT INTO members (
  family_id, name, gender, birth_year, death_year, 
  birthplace, current_location, occupation, bio, 
  generation, order_in_siblings, is_living, stories
) VALUES (
  :family_id,  -- 替换为实际的 family_id
  '金如香',
  1,  -- 男
  1931,
  2020,
  '湖北枣阳',
  '湖北安陆棠棣镇',
  '林业局干部/抗美援朝老兵',
  '出生于湖北枣阳，原姓周。幼年时逢战乱，成为孤儿，后被金姓人家收养。1950年参加抗美援朝，转业后到棠棣镇林业局工作。育有三子一女：金道武、金道富、金道莲、金道贵。',
  1,
  0,
  false,
  '[{"title": "枣阳出生", "year": 1931, "content": "出生于湖北枣阳，原姓周。幼年时逢战乱，成为孤儿，身世坎坷。"}, {"title": "抗美援朝", "year": 1950, "content": "参加中国人民志愿军，赴朝作战。"}, {"title": "转业棠棣", "year": 1958, "content": "转业到湖北省安陆县棠棣镇林业局工作。"}, {"title": "逝世", "year": 2020, "content": "在棠棣镇逝世，享年89岁。"}]'::jsonb
);

-- 第一代配偶：蒋忠英
INSERT INTO members (
  family_id, name, gender, birth_year, death_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living, spouse_id
) VALUES (
  :family_id,
  '蒋忠英',
  2,  -- 女
  1933,
  2015,
  '湖北安陆',
  '湖北安陆棠棣镇',
  '家庭主妇',
  '金如香妻子，安陆本地人。勤劳善良，操持家务，养育三子一女。',
  1,
  1,
  false,
  NULL  -- 需要在金如香插入后更新为金如香的 id
);

-- 注意：配偶关系需要在两人都插入后更新
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '蒋忠英') WHERE name = '金如香';
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '金如香') WHERE name = '蒋忠英';

-- ============================================================
-- 第二代
-- ============================================================

-- 金道武（长子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金道武',
  1,
  1957,
  '湖北安陆棠棣镇',
  '湖北安陆',
  '个体户（粮食收购）',
  '金如香长子。从事粮食收购生意，用卡车从农民手中收购粮食，销售 rice bran。勤劳肯干，支撑家庭。',
  2,
  0,
  true
);

-- 潘云芳（金道武妻子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '潘云芳',
  2,
  1958,
  '湖北安陆',
  '湖北安陆',
  '家庭主妇',
  '金道武妻子，安陆本地人。相夫教子，操持家务。',
  2,
  1,
  true
);

-- 金道富（次子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金道富',
  1,
  1960,
  '湖北安陆棠棣镇',
  '湖北安陆',
  '待补充',
  '金如香次子。具体信息待补充。',
  2,
  2,
  true
);

-- 金道莲（女儿）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金道莲',
  2,
  1962,
  '湖北安陆棠棣镇',
  '湖北安陆',
  '待补充',
  '金如香女儿。具体信息待补充。',
  2,
  3,
  true
);

-- 金道贵（三子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金道贵',
  1,
  1965,
  '湖北安陆棠棣镇',
  '湖北安陆',
  '待补充',
  '金如香三子。具体信息待补充。',
  2,
  4,
  true
);

-- ============================================================
-- 第三代：金道武的子女
-- ============================================================

-- 金亮（长子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金亮',
  1,
  1981,
  '湖北安陆棠棣镇',
  '四川成都',
  '待补充',
  '金道武长子。现居成都，育有两女。',
  3,
  0,
  true
);

-- 周丽娟（金亮妻子）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '周丽娟',
  2,
  1982,
  '四川',
  '四川成都',
  '待补充',
  '金亮妻子。',
  3,
  1,
  true
);

-- 金星（女儿）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金星',
  2,
  1983,
  '湖北安陆棠棣镇',
  '广东深圳',
  '待补充',
  '金道武女儿。现居深圳，丈夫谢明远，育有两女：谢忻然、谢芮安。',
  3,
  2,
  true
);

-- 谢明远（金星丈夫）
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, occupation, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '谢明远',
  1,
  1980,
  '待补充',
  '广东深圳',
  '待补充',
  '金星丈夫。',
  3,
  3,
  true
);

-- ============================================================
-- 第三代：金道富的子女（待补充）
-- ============================================================

-- ============================================================
-- 第三代：金道莲的子女（待补充）
-- ============================================================

-- ============================================================
-- 第三代：金道贵的子女（待补充）
-- ============================================================

-- ============================================================
-- 第四代：金亮的子女
-- ============================================================

-- 大女儿
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金氏长女',
  2,
  2010,
  '四川成都',
  '四川成都',
  '金亮长女。',
  4,
  0,
  true
);

-- 小女儿
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '金氏次女',
  2,
  2012,
  '四川成都',
  '四川成都',
  '金亮次女。',
  4,
  1,
  true
);

-- ============================================================
-- 第四代：金星的子女
-- ============================================================

-- 谢忻然
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '谢忻然',
  2,
  2013,
  '广东深圳',
  '广东深圳',
  '金星长女。',
  4,
  0,
  true
);

-- 谢芮安
INSERT INTO members (
  family_id, name, gender, birth_year,
  birthplace, current_location, bio,
  generation, order_in_siblings, is_living
) VALUES (
  :family_id,
  '谢芮安',
  2,
  2015,
  '广东深圳',
  '广东深圳',
  '金星次女。',
  4,
  1,
  true
);

-- ============================================================
-- 更新配偶关系（需要在所有成员插入后执行）
-- ============================================================

-- 金如香 ↔ 蒋忠英
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '蒋忠英' AND family_id = :family_id) 
-- WHERE name = '金如香' AND family_id = :family_id;
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '金如香' AND family_id = :family_id) 
-- WHERE name = '蒋忠英' AND family_id = :family_id;

-- 金道武 ↔ 潘云芳
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '潘云芳' AND family_id = :family_id) 
-- WHERE name = '金道武' AND family_id = :family_id;
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '金道武' AND family_id = :family_id) 
-- WHERE name = '潘云芳' AND family_id = :family_id;

-- 金亮 ↔ 周丽娟
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '周丽娟' AND family_id = :family_id) 
-- WHERE name = '金亮' AND family_id = :family_id;
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '金亮' AND family_id = :family_id) 
-- WHERE name = '周丽娟' AND family_id = :family_id;

-- 金星 ↔ 谢明远
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '谢明远' AND family_id = :family_id) 
-- WHERE name = '金星' AND family_id = :family_id;
-- UPDATE members SET spouse_id = (SELECT id FROM members WHERE name = '金星' AND family_id = :family_id) 
-- WHERE name = '谢明远' AND family_id = :family_id;

-- ============================================================
-- 更新 parent_id（父子关系）
-- ============================================================

-- 第二代 parent_id = 金如香
-- UPDATE members SET parent_id = (SELECT id FROM members WHERE name = '金如香' AND family_id = :family_id)
-- WHERE name IN ('金道武', '金道富', '金道莲', '金道贵') AND family_id = :family_id;

-- 第三代 parent_id = 金道武
-- UPDATE members SET parent_id = (SELECT id FROM members WHERE name = '金道武' AND family_id = :family_id)
-- WHERE name IN ('金亮', '金星') AND family_id = :family_id;

-- 第四代 parent_id = 金亮
-- UPDATE members SET parent_id = (SELECT id FROM members WHERE name = '金亮' AND family_id = :family_id)
-- WHERE name IN ('金氏长女', '金氏次女') AND family_id = :family_id;

-- 第四代 parent_id = 金星
-- UPDATE members SET parent_id = (SELECT id FROM members WHERE name = '金星' AND family_id = :family_id)
-- WHERE name IN ('谢忻然', '谢芮安') AND family_id = :family_id;
