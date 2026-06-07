-- 金氏家族种子数据
-- 基于 /var/www/courses/jiazu/ 的现有数据

-- 假设 family_id = '11111111-1111-1111-1111-111111111111'
-- 实际使用时替换为真实 family_id

INSERT INTO members (id, family_id, name, gender, birth_year, death_year, birthplace, occupation, bio, order_in_siblings, generation, is_living) VALUES
-- 第一代
('g1-1', '11111111-1111-1111-1111-111111111111', '金如香', 1, 1931, 2020, '湖北枣阳', '农民/抗美援朝老兵', '家族第一代，从枣阳迁徙至棠棣镇', 1, 1, false),
('g1-2', '11111111-1111-1111-1111-111111111111', '蒋忠英', 2, 1933, NULL, '湖北枣阳', '家庭主妇', '金如香配偶', 1, 1, true),

-- 第二代
('g2-1', '11111111-1111-1111-1111-111111111111', '金道武', 1, 1957, NULL, '湖北安陆棠棣镇', '个体户（粮食收购）', '金如香长子，粮食收购生意，大卡车运输', 1, 2, true),
('g2-2', '11111111-1111-1111-1111-111111111111', '潘云芳', 2, 1958, NULL, '湖北安陆', '家庭主妇', '金道武配偶', 1, 2, true),
('g2-3', '11111111-1111-1111-1111-111111111111', '金道富', 1, NULL, NULL, '湖北安陆棠棣镇', NULL, '金如香次子', 2, 2, true),
('g2-4', '11111111-1111-1111-1111-111111111111', '金道莲', 2, NULL, NULL, '湖北安陆棠棣镇', NULL, '金如香长女', 3, 2, true),

-- 第三代
('g3-1', '11111111-1111-1111-1111-111111111111', '金亮', 1, 1981, NULL, '湖北安陆棠棣镇', NULL, '金道武长子，定居成都', 1, 3, true),
('g3-2', '11111111-1111-1111-1111-111111111111', '周丽娟', 2, NULL, NULL, NULL, NULL, '金亮配偶', 1, 3, true),
('g3-3', '11111111-1111-1111-1111-111111111111', '金星', 2, 1983, NULL, '湖北安陆棠棣镇', NULL, '金道武长女，定居深圳', 2, 3, true),
('g3-4', '11111111-1111-1111-1111-111111111111', '谢明远', 1, NULL, NULL, NULL, NULL, '金星配偶', 1, 3, true),
('g3-5', '11111111-1111-1111-1111-111111111111', '金巧玲', 2, NULL, NULL, '湖北安陆棠棣镇', NULL, '金道富长女', 1, 3, true),
('g3-6', '11111111-1111-1111-1111-111111111111', '李栋', 1, NULL, NULL, NULL, NULL, '金巧玲配偶', 1, 3, true),
('g3-7', '11111111-1111-1111-1111-111111111111', '李金石', 1, NULL, NULL, NULL, NULL, '金道富长子', 2, 3, true),
('g3-8', '11111111-1111-1111-1111-111111111111', '金秀玲', 2, NULL, NULL, '湖北安陆棠棣镇', NULL, '金道莲长女', 1, 3, true),
('g3-9', '11111111-1111-1111-1111-111111111111', '吴志安', 1, NULL, NULL, NULL, NULL, '金秀玲配偶', 1, 3, true),

-- 第四代（金亮家）
('g4-1', '11111111-1111-1111-1111-111111111111', '金珊', 2, NULL, NULL, '四川成都', NULL, '金亮长女', 1, 4, true),
('g4-2', '11111111-1111-1111-1111-111111111111', '金灿', 1, NULL, NULL, '四川成都', NULL, '金亮长子', 2, 4, true),

-- 第四代（金星家）
('g4-3', '11111111-1111-1111-1111-111111111111', '谢忻然', 2, 2013, NULL, '广东深圳', NULL, '金星长女', 1, 4, true),
('g4-4', '11111111-1111-1111-1111-111111111111', '谢芮安', 2, 2015, NULL, '广东深圳', NULL, '金星次女', 2, 4, true),

-- 第四代（金秀玲家）
('g4-5', '11111111-1111-1111-1111-111111111111', '吴大磊', 1, NULL, NULL, NULL, NULL, '金秀玲长子', 1, 4, true),
('g4-6', '11111111-1111-1111-1111-111111111111', '吴晓磊', 1, NULL, NULL, NULL, NULL, '金秀玲次子', 2, 4, true),

-- 第四代（金巧玲家）
('g4-7', '11111111-1111-1111-1111-111111111111', '— 待补充', 0, NULL, NULL, NULL, NULL, '金巧玲子女', 1, 4, true),

-- 第四代（李金石家）
('g4-8', '11111111-1111-1111-1111-111111111111', '— 待补充', 0, NULL, NULL, NULL, NULL, '李金石子女', 1, 4, true),

-- 第四代（吴大磊家）
('g4-9', '11111111-1111-1111-1111-111111111111', '— 待补充', 0, NULL, NULL, NULL, NULL, '吴大磊子女', 1, 4, true),

-- 第四代（吴晓磊家）
('g4-10', '11111111-1111-1111-1111-111111111111', '— 待补充', 0, NULL, NULL, NULL, NULL, '吴晓磊子女', 1, 4, true);

-- 建立配偶关系
UPDATE members SET spouse_id = 'g1-2' WHERE id = 'g1-1';
UPDATE members SET spouse_id = 'g1-1' WHERE id = 'g1-2';
UPDATE members SET spouse_id = 'g2-2' WHERE id = 'g2-1';
UPDATE members SET spouse_id = 'g2-1' WHERE id = 'g2-2';
UPDATE members SET spouse_id = 'g3-2' WHERE id = 'g3-1';
UPDATE members SET spouse_id = 'g3-1' WHERE id = 'g3-2';
UPDATE members SET spouse_id = 'g3-4' WHERE id = 'g3-3';
UPDATE members SET spouse_id = 'g3-3' WHERE id = 'g3-4';
UPDATE members SET spouse_id = 'g3-6' WHERE id = 'g3-5';
UPDATE members SET spouse_id = 'g3-5' WHERE id = 'g3-6';
UPDATE members SET spouse_id = 'g3-9' WHERE id = 'g3-8';
UPDATE members SET spouse_id = 'g3-8' WHERE id = 'g3-9';

-- 建立父子关系
UPDATE members SET parent_id = 'g2-1' WHERE id IN ('g3-1', 'g3-3');
UPDATE members SET parent_id = 'g2-2' WHERE id IN ('g3-1', 'g3-3');
UPDATE members SET parent_id = 'g2-3' WHERE id IN ('g3-5', 'g3-7');
UPDATE members SET parent_id = 'g2-4' WHERE id IN ('g3-8');
UPDATE members SET parent_id = 'g3-1' WHERE id IN ('g4-1', 'g4-2');
UPDATE members SET parent_id = 'g3-2' WHERE id IN ('g4-1', 'g4-2');
UPDATE members SET parent_id = 'g3-3' WHERE id IN ('g4-3', 'g4-4');
UPDATE members SET parent_id = 'g3-4' WHERE id IN ('g4-3', 'g4-4');
UPDATE members SET parent_id = 'g3-8' WHERE id IN ('g4-5', 'g4-6');
UPDATE members SET parent_id = 'g3-9' WHERE id IN ('g4-5', 'g4-6');
UPDATE members SET parent_id = 'g3-5' WHERE id = 'g4-7';
UPDATE members SET parent_id = 'g3-6' WHERE id = 'g4-7';
UPDATE members SET parent_id = 'g3-7' WHERE id = 'g4-8';
UPDATE members SET parent_id = 'g4-5' WHERE id = 'g4-9';
UPDATE members SET parent_id = 'g4-6' WHERE id = 'g4-10';
